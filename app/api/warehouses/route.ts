

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateWarehouseSchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted, softDeletePayload } from "@/lib/response";
import { cacheGet, cacheSet, cacheDel } from "@/lib/redis";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const cacheKey = `warehouses:p${page}:city:${city}:state:${state}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return apiSuccess((cached as Record<string, unknown>).data, "Warehouses (cached)", (cached as Record<string, unknown>).meta as Record<string, unknown>);

    const where = {
        isActive: true,
        ...notDeleted(),
        ...(city && { city: { contains: city, mode: "insensitive" as const } }),
        ...(state && { state: { contains: state, mode: "insensitive" as const } }),
    };

    const [warehouses, total] = await Promise.all([
        prisma.warehouse.findMany({
            where, skip, take: limit,
            orderBy: { name: "asc" },
            // include: { manager: { select: { id: true, firstName: true, lastName: true } } },
        }),
        prisma.warehouse.count({ where }),
    ]);

    const meta = buildMeta(total, page, limit);
    await cacheSet(cacheKey, { data: warehouses, meta }, 600);
    return apiSuccess(warehouses, "Warehouses retrieved", meta);
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["WAREHOUSE_MANAGER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only warehouse managers can create warehouses");
    }

    try {
        const body = await req.json();
        const parsed = CreateWarehouseSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const warehouse = await prisma.warehouse.create({
            data: { ...parsed.data, managerId: auth.user.sub },
        });
        await cacheDel("warehouses:*");
        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Warehouse", entityId: warehouse.id, req });
        return apiCreated(warehouse, "Warehouse created");
    } catch (err) {
        return apiServerError(err);
    }
}
