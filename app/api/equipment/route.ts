

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateEquipmentSchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted, softDeletePayload } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");
    const farmId = searchParams.get("farmId");
    const isAdmin = ["SUPER_ADMIN", "WAREHOUSE_MANAGER"].includes(auth.user.role);

    const where = {
        ...notDeleted(),
        ...(farmId && { farmId }),
        ...(status && { status: status as never }),
        ...(!isAdmin && { userId: auth.user.sub }),
    };

    const [items, total] = await Promise.all([
        prisma.equipment.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: { farm: { select: { id: true, name: true } } },
        }),
        prisma.equipment.count({ where }),
    ]);

    return apiSuccess(items, "Equipment retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = CreateEquipmentSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const item = await prisma.equipment.create({
            data: {
                ...parsed.data,
                userId: auth.user.sub,
                purchaseDate: parsed.data.purchaseDate ? new Date(parsed.data.purchaseDate) : undefined,
                lastServiceDate: parsed.data.lastServiceDate ? new Date(parsed.data.lastServiceDate) : undefined,
                nextServiceDate: parsed.data.nextServiceDate ? new Date(parsed.data.nextServiceDate) : undefined,
                imageUrls: parsed.data.imageUrls ?? [],
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Equipment", entityId: item.id, req });
        return apiCreated(item, "Equipment created");
    } catch (err) {
        return apiServerError(err);
    }
}
