

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateEquipmentSchema } from "@/validators/schemas";
import { notDeleted, softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const item = await prisma.equipment.findFirst({
        where: { id, ...notDeleted() },
        include: { farm: { select: { id: true, name: true } } },
    });
    if (!item) return apiNotFound("Equipment not found");
    if (item.userId !== auth.user.sub && !["SUPER_ADMIN", "WAREHOUSE_MANAGER"].includes(auth.user.role)) {
        return apiForbidden();
    }
    return apiSuccess(item, "Equipment retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const item = await prisma.equipment.findFirst({ where: { id, ...notDeleted() } });
    if (!item) return apiNotFound("Equipment not found");
    if (item.userId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();

    try {
        const body = await req.json();
        const parsed = CreateEquipmentSchema.partial().safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.equipment.update({
            where: { id },
            data: {
                ...parsed.data,
                purchaseDate: parsed.data.purchaseDate ? new Date(parsed.data.purchaseDate) : undefined,
                lastServiceDate: parsed.data.lastServiceDate ? new Date(parsed.data.lastServiceDate) : undefined,
                nextServiceDate: parsed.data.nextServiceDate ? new Date(parsed.data.nextServiceDate) : undefined,
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "Equipment", entityId: id, req });
        return apiSuccess(updated, "Equipment updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const item = await prisma.equipment.findFirst({ where: { id, ...notDeleted() } });
    if (!item) return apiNotFound("Equipment not found");
    if (item.userId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();

    await prisma.equipment.update({ where: { id }, data: softDeletePayload() });
    return apiSuccess(null, "Equipment deleted");
}
