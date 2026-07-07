

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiServerError, apiNotFound, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { RevokeSessionSchema } from "@/validators/schemas";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const sessions = await prisma.session.findMany({
            where: { userId: auth.user.sub, isRevoked: false, expiresAt: { gt: new Date() } },
            select: {
                id: true,
                deviceInfo: true,
                ipAddress: true,
                createdAt: true,
                expiresAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return apiSuccess(sessions, "Active sessions retrieved");
    } catch (err) {
        return apiServerError(err);
    }
}
