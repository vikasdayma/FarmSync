

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiBadRequest, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CreateOrderSchema } from "@/validators/schemas";
import { getPagination, buildMeta, getSortOrder } from "@/lib/response";
import { Decimal } from "decimal.js";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");
    const role = searchParams.get("role"); // "buyer" | "seller" | null

    const isAdmin = ["SUPER_ADMIN", "GOVERNMENT_OFFICER"].includes(auth.user.role);

    let roleFilter = {};
    if (!isAdmin) {
        if (role === "buyer") {
            roleFilter = { buyerId: auth.user.sub };
        } else if (role === "seller") {
            roleFilter = { supplierId: auth.user.sub };
        } else {
            // no role specified — fallback: show orders where user is either buyer or seller
            roleFilter = { OR: [{ buyerId: auth.user.sub }, { supplierId: auth.user.sub }] };
        }
    }

    const where = {
        ...(status && { status: status as never }),
        ...roleFilter,
    };

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where, skip, take: limit,
            orderBy: getSortOrder(searchParams, ["createdAt", "totalAmount", "status"]),
            include: {
                buyer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        address: true,
                    },
                },
                supplier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        address: true,
                    },
                },
                items: {
                    include: {
                        listing: true,
                    },
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        method: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: {
                        payments: true,
                        items: true,
                    },
                },
            },
        }),
        prisma.order.count({ where }),
    ]);

    return apiSuccess(orders, "Orders retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = CreateOrderSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { supplierId, items, shippingAddress, notes } = parsed.data;

        const supplier = await prisma.user.findFirst({
            where: { id: supplierId, role: "SUPPLIER", status: "ACTIVE" },
        });
        if (!supplier) return apiNotFound("Supplier not found or inactive");

        const inventoryIds = items.map((i) => i.inventoryId);
        const inventoryItems = await prisma.inventory.findMany({
            where: { id: { in: inventoryIds }, isActive: true },
        });

        if (inventoryItems.length !== items.length) {
            return apiBadRequest("One or more inventory items not found or inactive");
        }

        for (const orderItem of items) {
            const inv = inventoryItems.find((i) => i.id === orderItem.inventoryId)!;
            if (inv.quantityKg < orderItem.quantity) {
                return apiBadRequest(`Insufficient stock for "${inv.name}" (available: ${inv.quantityKg} kg, requested: ${orderItem.quantity} kg)`);
            }
        }

        let subtotal = new Decimal(0);
        const orderItemsData = items.map((i) => {
            const inv = inventoryItems.find((inv) => inv.id === i.inventoryId)!;
            const lineTotal = inv.unitPrice.mul(i.quantity);
            subtotal = subtotal.add(lineTotal);
            return {
                inventoryId: i.inventoryId,
                quantity: i.quantity,
                unitPrice: inv.unitPrice,
                total: lineTotal,
            };
        });

        const order = await prisma.$transaction(async (tx) => {
                const orderNo = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
            const newOrder = await tx.order.create({
                data: {
                    orderNo,
                    buyerId: auth.user.sub,
                    supplierId,
                    totalAmount: subtotal,
                    shippingAddress,
                    notes,
                    items: { create: orderItemsData },
                },
                include: { items: true },
            });

            for (const i of items) {
                await tx.inventory.update({
                    where: { id: i.inventoryId },
                    data: { quantityKg: { decrement: i.quantity } },
                });
            }

            return newOrder;
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Order", entityId: order.id, req });
        await createNotification({
            userId: supplierId,
            type: "INFO",
            title: "New Order Received",
            body: `Order #${order.orderNo} for ₹${subtotal} received from a buyer.`,
            metadata: { orderId: order.id },
        });

        return apiCreated(order, "Order created successfully");
    } catch (err) {
        return apiServerError(err);
    }
}