

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiBadRequest, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CreatePaymentSchema } from "@/validators/schemas";
import { getPagination, buildMeta } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const orderId = searchParams.get("orderId");
    const isAdmin = ["SUPER_ADMIN"].includes(auth.user.role);

    const where = {
        ...(orderId && { orderId }),
        ...(!isAdmin && { userId: auth.user.sub }),
    };

    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: { order: { select: { id: true, orderNo: true, totalAmount: true } } },
        }),
        prisma.payment.count({ where }),
    ]);

    return apiSuccess(payments, "Payments retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = CreatePaymentSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        
        const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
        if (!order) return apiNotFound("Order not found");
        if (order.buyerId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();
        if (order.status === "CANCELLED") return apiBadRequest("Cannot pay for a cancelled order");

       const payment = await prisma.payment.create({
    data: {
        ...parsed.data,
        userId: auth.user.sub,
        status: "COMPLETED",
        paidAt: new Date(),
    },
});

await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: "CONFIRMED" },
});

        await createNotification({
            userId: order.supplierId,
            type: "SUCCESS",
            title: "Payment Received",
            body: `Payment of ₹${payment.amount} received for order #${order.orderNo}.`,
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Payment", entityId: payment.id, req });
        return apiCreated(payment, "Payment recorded and order confirmed");
    } catch (err) {
        return apiServerError(err);
    }
}
