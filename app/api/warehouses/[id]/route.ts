

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateWarehouseSchema } from "@/validators/schemas";
import { notDeleted, softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const warehouse = await prisma.warehouse.findFirst({
        where: { id, ...notDeleted() },
        include: {
//          manager: { select: { id: true, firstName: true, lastName: true } },
// inventories: { where: { isActive: true }, select: { id: true, name: true, category: true, quantityKg: true, unitPrice: true } },
// _count: { select: { inventories: true } },
        },
    });
    if (!warehouse) return apiNotFound("Warehouse not found");
    return apiSuccess(warehouse, "Warehouse retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["WAREHOUSE_MANAGER", "SUPER_ADMIN"].includes(auth.user.role)) return apiForbidden();
    const { id } = await params;

    const warehouse = await prisma.warehouse.findFirst({ where: { id, ...notDeleted() } });
    if (!warehouse) return apiNotFound("Warehouse not found");
    if (warehouse.managerId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();

    try {
        const body = await req.json();
        const parsed = CreateWarehouseSchema.partial().safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.warehouse.update({ where: { id }, data: parsed.data });
        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "Warehouse", entityId: id, req });
        return apiSuccess(updated, "Warehouse updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (auth.user.role !== "SUPER_ADMIN") return apiForbidden("Only super admins can delete warehouses");
    const { id } = await params;

    const warehouse = await prisma.warehouse.findFirst({ where: { id, ...notDeleted() } });
    if (!warehouse) return apiNotFound("Warehouse not found");

    await prisma.warehouse.update({ where: { id }, data: { ...softDeletePayload(), isActive: false } });
    return apiSuccess(null, "Warehouse deleted");
}
