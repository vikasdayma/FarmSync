

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CreateInventorySchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted, softDeletePayload } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const warehouseId = searchParams.get("warehouseId");
    const lowStock = searchParams.get("lowStock") === "true";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");

    const where = {
        isActive: true,
        ...notDeleted(),
        ...(warehouseId && { warehouseId }),
        ...(category && { category }),
        ...(lowStock && { quantityKg: { lte: prisma.inventory.fields.reorderLevel } }),
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { sku: { contains: search, mode: "insensitive" as const } },
                { category: { contains: search, mode: "insensitive" as const } },
            ]
        }),
    };

    const [items, total] = await Promise.all([
        prisma.inventory.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: { warehouse: { select: { id: true, name: true, city: true } } },
        }),
        prisma.inventory.count({ where }),
    ]);

    return apiSuccess(items, "Inventory retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["WAREHOUSE_MANAGER", "SUPPLIER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only warehouse managers and suppliers can add inventory");
    }

    try {
        const body = await req.json();
        const parsed = CreateInventorySchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const item = await prisma.inventory.create({
            data: {
                ...parsed.data,
                expiryDate: parsed.data.expiryDate ? new Date(parsed.data.expiryDate) : undefined,
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Inventory", entityId: item.id, req });
        return apiCreated(item, "Inventory item created");
    } catch (err) {
        return apiServerError(err);
    }
}
