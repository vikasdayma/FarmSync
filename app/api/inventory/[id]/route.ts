

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateInventorySchema } from "@/validators/schemas";
import { notDeleted, softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };
const INVENTORY_ROLES = ["WAREHOUSE_MANAGER", "SUPPLIER", "SUPER_ADMIN"];

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const item = await prisma.inventory.findFirst({
        where: { id, ...notDeleted() },
        include: { warehouse: { select: { id: true, name: true, city: true } } },
    });
    if (!item) return apiNotFound("Inventory item not found");
    return apiSuccess(item, "Inventory item retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!INVENTORY_ROLES.includes(auth.user.role)) return apiForbidden();
    const { id } = await params;

    const item = await prisma.inventory.findFirst({ where: { id, ...notDeleted() } });
    if (!item) return apiNotFound("Inventory item not found");

    try {
        const body = await req.json();
        const parsed = CreateInventorySchema.partial().safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.inventory.update({
            where: { id },
            data: { ...parsed.data, expiryDate: parsed.data.expiryDate ? new Date(parsed.data.expiryDate) : undefined },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "Inventory", entityId: id, req });
        return apiSuccess(updated, "Inventory item updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!INVENTORY_ROLES.includes(auth.user.role)) return apiForbidden();
    const { id } = await params;

    const item = await prisma.inventory.findFirst({ where: { id, ...notDeleted() } });
    if (!item) return apiNotFound("Inventory item not found");

    await prisma.inventory.update({ where: { id }, data: softDeletePayload() });
    await createAuditLog({ actorId: auth.user.sub, action: "DELETE", entity: "Inventory", entityId: id, req });
    return apiSuccess(null, "Inventory item deleted");
}
