

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { RevokeSessionSchema } from "@/validators/schemas";

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = RevokeSessionSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { sessionId } = parsed.data;

        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (!session) return apiNotFound("Session not found");
        if (session.userId !== auth.user.sub) return apiForbidden("Cannot revoke another user's session");

        await prisma.session.update({
            where: { id: sessionId },
            data: { isRevoked: true, revokedAt: new Date() },
        });

        return apiSuccess(null, "Session revoked successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
