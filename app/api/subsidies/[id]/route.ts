

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiBadRequest, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { notDeleted, softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const subsidy = await prisma.subsidy.findFirst({
        where: { id, ...notDeleted() },
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    if (!subsidy) return apiNotFound("Subsidy not found");
    if (subsidy.userId !== auth.user.sub && !["SUPER_ADMIN", "GOVERNMENT_OFFICER"].includes(auth.user.role)) {
        return apiForbidden();
    }
    return apiSuccess(subsidy, "Subsidy retrieved");
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const subsidy = await prisma.subsidy.findFirst({ where: { id, ...notDeleted() } });
    if (!subsidy) return apiNotFound("Subsidy not found");
    if (subsidy.userId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();
    if (subsidy.status !== "DRAFT") return apiBadRequest("Only DRAFT applications can be deleted");

    await prisma.subsidy.update({ where: { id }, data: softDeletePayload() });
    return apiSuccess(null, "Subsidy application deleted");
}
