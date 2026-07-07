

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

    try {
        const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
        if (!user) return apiNotFound("User not found");
        if (user.status !== "SUSPENDED") return apiBadRequest("User is not suspended");

        await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });

        await createNotification({
            userId: id,
            type: "SUCCESS",
            title: "Account Reinstated",
            body: "Your account has been reinstated. You can now log in again.",
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UNBAN", entity: "User", entityId: id, req });
        return apiSuccess(null, "User account reinstated successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
