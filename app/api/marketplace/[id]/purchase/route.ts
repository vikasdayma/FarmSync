


import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiCreated,
  apiBadRequest,
  apiNotFound,
  apiForbidden,
  apiServerError,
  apiValidationError,
} from "@/lib/response";
import {
  getAuthUser,
  createAuditLog,
  createNotification,
} from "@/middleware/auth";
import { PurchaseListingSchema } from "@/validators/schemas";
import { notDeleted } from "@/lib/response";
// import { MarketplaceStatus } from "@prisma/client"; // ✅ FIXED ENUM

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = PurchaseListingSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten().fieldErrors);
    }

    const listing = await prisma.marketplaceListing.findFirst({
      where: { id, status: "ACTIVE", ...notDeleted() },
      include: { seller: { select: { id: true, firstName: true } } },
    });

    if (!listing) {
      return apiNotFound("Listing not found or no longer active");
    }

    if (listing.sellerId === auth.user.sub) {
      return apiForbidden("Cannot purchase your own listing");
    }

    const qty = parsed.data.quantity ?? 1;
    const total = listing.pricePerUnit.mul(qty);
    const newStock = listing.quantityAvailable - qty;

    if (newStock < 0) {
      return apiBadRequest(
        `Only ${listing.quantityAvailable} ${listing.unit} available`
      );
    }

const order = await prisma.$transaction(async (tx) => {
  // ✅ 2. Create Order
  const order = await tx.order.create({
    data: {
      orderNo: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      buyerId: auth.user.sub,
      supplierId: listing.sellerId,
      totalAmount: total,
      shippingAddress: parsed.data.shippingAddress,
      notes: parsed.data.notes,
    },
  });

  // ✅ 3. Create Order Item
  await tx.orderItem.create({
    data: {
      orderId: order.id,
      inventoryId: listing.id,
      quantity: qty,
      unitPrice: listing.pricePerUnit,
      total: total,
    },
  });

  // ✅ 4. Decrement listing stock
  await tx.marketplaceListing.update({
    where: { id: listing.id },
    data: { quantityAvailable: { decrement: qty } },
  });

  return order;
});

    // ✅ 4. Notification
    await createNotification({
      userId: listing.sellerId,
      type: "SUCCESS",
      title: "New Order!",
      body: `"${listing.title}" was purchased (${qty} ${listing.unit}) for ₹${total}.`,
      metadata: { orderId: order.id },
    });

    // ✅ 5. Audit log
    await createAuditLog({
      actorId: auth.user.sub,
      action: "CREATE",
      entity: "Order",
      entityId: order.id,
      req,
    });

    return apiCreated(order, "Order placed successfully");
  } catch (err: any) {
    console.error("🔴🔴🔴 CAUGHT ERROR 🔴🔴🔴");
    console.error("META:", JSON.stringify(err?.meta, null, 2));
    console.error("CODE:", err?.code);
    console.error("MESSAGE:", err?.message);
    return apiServerError(err?.message || "Internal server error");
  }
}

