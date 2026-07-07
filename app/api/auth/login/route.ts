

import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";


import {
    apiSuccess, apiBadRequest, apiUnauthorized, apiForbidden,
    apiValidationError, apiServerError,
} from "@/lib/response";
import { LoginSchema } from "@/validators/schemas";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { createAuditLog, withRateLimit } from "@/middleware/auth";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; 


export async function POST(req: NextRequest) {

    const rl = await withRateLimit(req, undefined, 10, 60_000);
    if (rl.limited) return rl.response!;

    try {
        const body = await req.json();
        const parsed = LoginSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true, email: true, passwordHash: true, firstName: true,
                lastName: true, role: true, status: true, failedLoginAttempts: true,
                lockedUntil: true, emailVerified: true, deletedAt: true,
            },
        });

        if (!user || user.deletedAt) {
            return apiUnauthorized("Invalid email or password");
        }

        
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const unlockAt = user.lockedUntil.toISOString();
            return apiForbidden(`Account locked until ${unlockAt}. Too many failed attempts.`);
        }

        
        if (user.status === "SUSPENDED") return apiForbidden("Account is suspended. Contact support.");
        if (user.status === "PENDING_VERIFICATION") {
            return apiForbidden("Please verify your email before logging in.");
        }

        
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            const newFailCount = user.failedLoginAttempts + 1;
            const shouldLock = newFailCount >= MAX_FAILED_ATTEMPTS;

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: newFailCount,
                    status: shouldLock ? "LOCKED" : undefined,
                    lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : undefined,
                },
            });

            if (shouldLock) {
                return apiForbidden(`Account locked for 15 minutes after ${MAX_FAILED_ATTEMPTS} failed attempts.`);
            }

            return apiUnauthorized(
                `Invalid email or password. ${MAX_FAILED_ATTEMPTS - newFailCount} attempts remaining.`
            );
        }

        
        const sessionId = uuidv4();
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role, sessionId });
        const refreshToken = signRefreshToken({ sub: user.id, sessionId });
        const refreshHash = await bcrypt.hash(refreshToken, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockedUntil: null,
                    status: user.status === "LOCKED" ? "ACTIVE" : undefined,
                    lastLoginAt: new Date(),
                    lastLoginIp: ip,
                    refreshTokenHash: refreshHash,
                },
            }),
            prisma.session.create({
                data: {
                    id: sessionId,
                    userId: user.id,
                    refreshToken: refreshToken,
                    ipAddress: ip,
                    userAgent: userAgent,
                    deviceInfo: userAgent.substring(0, 200),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            }),
        ]);

        await createAuditLog({
            actorId: user.id, action: "LOGIN", entity: "User", entityId: user.id, req,
        });

   
const response = NextResponse.json({
  success: true,
  user: {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  },
});

response.cookies.set("accessToken", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60, // 1 hour
});

response.cookies.set("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
});

return response;
    } catch (err) {
        return apiServerError(err);
    }
}
