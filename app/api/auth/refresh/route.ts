

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiBadRequest, apiUnauthorized, apiServerError, apiValidationError } from "@/lib/response";
import { RefreshTokenSchema } from "@/validators/schemas";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = RefreshTokenSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { refreshToken } = parsed.data;

        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            return apiUnauthorized("Invalid or expired refresh token");
        }

        
        const session = await prisma.session.findUnique({
            where: { refreshToken },
            include: { user: { select: { id: true, email: true, role: true, status: true, deletedAt: true } } },
        });

        if (!session || session.isRevoked || session.expiresAt < new Date()) {
            return apiUnauthorized("Session expired or revoked. Please log in again.");
        }
        if (!session.user || session.user.deletedAt || session.user.status === "SUSPENDED") {
            return apiUnauthorized("User account is no longer active");
        }

        
        const newRefreshToken = signRefreshToken({ sub: session.userId, sessionId: session.id });
        const newAccessToken = signAccessToken({
            sub: session.userId,
            email: session.user.email,
            role: session.user.role,
            sessionId: session.id,
        });

        await prisma.session.update({
            where: { id: session.id },
            data: {
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return apiSuccess({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }, "Token refreshed successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
