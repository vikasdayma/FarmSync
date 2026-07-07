

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiBadRequest, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { AdjustInventorySchema } from "@/validators/schemas";
import { notDeleted } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["WAREHOUSE_MANAGER", "SUPPLIER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only warehouse managers can adjust stock");
    }
    const { id } = await params;

    try {
        const body = await req.json();
        const parsed = AdjustInventorySchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const item = await prisma.inventory.findFirst({ where: { id, ...notDeleted() } });
        if (!item) return apiNotFound("Inventory item not found");

        const newQty = item.quantityKg + parsed.data.quantityKg;
        if (newQty < 0) {
            return apiBadRequest(
                `Cannot reduce stock below zero. Current: ${item.quantityKg} kg, Requested change: ${parsed.data.quantityKg} kg`
            );
        }

        const updated = await prisma.inventory.update({
            where: { id },
            data: { quantityKg: newQty },
        });

        
        if (newQty <= item.reorderLevel && newQty > 0) {
            await createNotification({
                userId: auth.user.sub,
                type: "WARNING",
                title: "Low Stock Alert",
                body: `"${item.name}" (SKU: ${item.sku}) is at ${newQty} kg — below reorder level of ${item.reorderLevel} kg.`,
                metadata: { inventoryId: id, currentQty: newQty },
            });
        }

        await createAuditLog({
            actorId: auth.user.sub,
            action: "UPDATE",
            entity: "Inventory",
            entityId: id,
            oldValue: { quantityKg: item.quantityKg },
            newValue: { quantityKg: newQty, reason: parsed.data.reason },
            req,
        });

        return apiSuccess(
            { id, sku: item.sku, previousQty: item.quantityKg, newQty, reason: parsed.data.reason },
            `Stock adjusted by ${parsed.data.quantityKg} kg`
        );
    } catch (err) {
        return apiServerError(err);
    }
}
