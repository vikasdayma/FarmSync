

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiBadRequest, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CancelOrderSchema } from "@/validators/schemas";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    try {
        const body = await req.json();
        const parsed = CancelOrderSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!order) return apiNotFound("Order not found");
        if (!["PENDING", "CONFIRMED"].includes(order.status)) {
            return apiBadRequest(`Cannot cancel order in "${order.status}" status. Only PENDING or CONFIRMED orders can be cancelled.`);
        }
        if (order.buyerId !== auth.user.sub && order.supplierId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") {
            return apiForbidden();
        }

        
        await prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id },
                data: { status: "CANCELLED", cancelReason: parsed.data.reason, cancelledAt: new Date() },
            });

            for (const item of order.items) {
                await tx.inventory.update({
                    where: { id: item.inventoryId },
                    data: { quantityKg: { increment: item.quantity } },
                });
            }
        });

        const notifyId = auth.user.sub === order.buyerId ? order.supplierId : order.buyerId;
        await createNotification({
            userId: notifyId,
            type: "WARNING",
            title: "Order Cancelled",
            body: `Order #${order.orderNo} was cancelled. Reason: ${parsed.data.reason}`,
            metadata: { orderId: id },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "Order", entityId: id, req, metadata: { action: "CANCEL", reason: parsed.data.reason } });
        return apiSuccess(null, "Order cancelled successfully. Stock restored.");
    } catch (err) {
        return apiServerError(err);
    }
}
