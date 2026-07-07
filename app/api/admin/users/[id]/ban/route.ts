

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiBadRequest, apiNotFound, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (auth.user.role !== "SUPER_ADMIN") return apiForbidden();
    const { id } = await params;
    if (id === auth.user.sub) return apiBadRequest("Cannot ban your own account");

    try {
        const { reason } = await req.json() as { reason?: string };

        const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
        if (!user) return apiNotFound("User not found");
        if (user.status === "SUSPENDED") return apiBadRequest("User is already suspended");

        await prisma.$transaction([
            prisma.user.update({ where: { id }, data: { status: "SUSPENDED" } }),
            prisma.session.updateMany({ where: { userId: id }, data: { isRevoked: true, revokedAt: new Date() } }),
        ]);

        await createAuditLog({ actorId: auth.user.sub, action: "BAN", entity: "User", entityId: id, req, metadata: { reason } });
        return apiSuccess(null, `User ${user.firstName} ${user.lastName} has been banned. All sessions revoked.`);
    } catch (err) {
        return apiServerError(err);
    }
}
