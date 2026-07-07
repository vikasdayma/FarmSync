

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiBadRequest, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CancelOrderSchema } from "@/validators/schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            buyer: { select: { id: true, firstName: true, lastName: true, email: true } },
            supplier: { select: { id: true, firstName: true, lastName: true, email: true } },
          items: { include: { listing: { select: { id: true, title: true, category: true } } } },
            payments: { select: { id: true, amount: true, status: true, method: true, paidAt: true } },
        },
    });

    if (!order) return apiNotFound("Order not found");
    const isAdmin = ["SUPER_ADMIN", "GOVERNMENT_OFFICER"].includes(auth.user.role);
    if (order.buyerId !== auth.user.sub && order.supplierId !== auth.user.sub && !isAdmin) {
        return apiForbidden("Access denied to this order");
    }
    return apiSuccess(order, "Order retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return apiNotFound("Order not found");
    if (order.supplierId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();

    try {
        const body = await req.json();
        const { status, notes } = body;
        const validStatuses = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
        if (!validStatuses.includes(status)) {
            return apiBadRequest(`Status must be one of: ${validStatuses.join(", ")}`);
        }

        const updated = await prisma.order.update({
            where: { id },
            data: { status, notes, ...(status === "DELIVERED" && { deliveredAt: new Date() }) },
        });

        await createNotification({
            userId: order.buyerId,
            type: "INFO",
            title: `Order ${status}`,
            body: `Your order #${order.orderNo} status has been updated to ${status}.`,
            metadata: { orderId: id },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "Order", entityId: id, req });
        return apiSuccess(updated, "Order status updated");
    } catch (err) {
        return apiServerError(err);
    }
}
