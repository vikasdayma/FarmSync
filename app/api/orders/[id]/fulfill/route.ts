

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiBadRequest, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["SUPPLIER", "SUPER_ADMIN"].includes(auth.user.role)) return apiForbidden();
    const { id } = await params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return apiNotFound("Order not found");
    if (order.supplierId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();
    if (!["CONFIRMED", "PROCESSING"].includes(order.status)) {
        return apiBadRequest(`Cannot fulfill order in "${order.status}" status`);
    }

    try {
        const updated = await prisma.order.update({
            where: { id },
            data: { status: "SHIPPED", deliveredAt: undefined },
        });

        await createNotification({
            userId: order.buyerId,
            type: "SUCCESS",
            title: "Order Shipped!",
            body: `Your order #${order.orderNo} has been fulfilled and is on its way.`,
            metadata: { orderId: id },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "Order", entityId: id, req });
        return apiSuccess(updated, "Order marked as shipped");
    } catch (err) {
        return apiServerError(err);
    }
}
