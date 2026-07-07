

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { UpdateFarmSchema } from "@/validators/schemas";
import { notDeleted, softDeletePayload } from "@/lib/response";
import { cacheGet, cacheSet, cacheDel } from "@/lib/redis";

type Params = { params: Promise<{ id: string }> };

async function getFarmOrFail(id: string, userId: string, role: string) {
    const farm = await prisma.farm.findFirst({
        where: { id, ...notDeleted() },
    });
    if (!farm) return null;
    if (farm.ownerId !== userId && !["SUPER_ADMIN", "GOVERNMENT_OFFICER"].includes(role)) {
        return "forbidden";
    }
    return farm;
}

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const cacheKey = `farm:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return apiSuccess(cached, "Farm retrieved (cached)");

    const farm = await prisma.farm.findFirst({
        where: { id, ...notDeleted() },
        include: {
            owner: { select: { id: true, firstName: true, lastName: true, email: true } },
            cropCycles: { where: notDeleted(), orderBy: { createdAt: "desc" }, take: 5 },
            soilReports: { where: notDeleted(), orderBy: { createdAt: "desc" }, take: 3 },
            _count: { select: { equipments: true, diseaseReports: true, weatherLogs: true } },
        }
    });

    if (!farm) return apiNotFound("Farm not found");
    if (farm.ownerId !== auth.user.sub && !["SUPER_ADMIN", "GOVERNMENT_OFFICER"].includes(auth.user.role)) {
        return apiForbidden("You do not have access to this farm");
    }

    await cacheSet(cacheKey, farm, 300);
    return apiSuccess(farm, "Farm retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    try {
        const farm = await getFarmOrFail(id, auth.user.sub, auth.user.role);
        if (!farm) return apiNotFound("Farm not found");
        if (farm === "forbidden") return apiForbidden("You do not own this farm");

        const body = await req.json();
        const parsed = UpdateFarmSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.farm.update({
            where: { id },
            data: parsed.data,
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "Farm", entityId: id, oldValue: farm as Record<string, unknown>, newValue: updated as Record<string, unknown>, req });
        await cacheDel(`farm:${id}`);

        return apiSuccess(updated, "Farm updated successfully");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    try {
        const farm = await getFarmOrFail(id, auth.user.sub, auth.user.role);
        if (!farm) return apiNotFound("Farm not found");
        if (farm === "forbidden") return apiForbidden("You do not own this farm");

        await prisma.farm.update({ where: { id }, data: softDeletePayload() });
        await createAuditLog({ actorId: auth.user.sub, action: "DELETE", entity: "Farm", entityId: id, req });
        await cacheDel(`farm:${id}`);

        return apiSuccess(null, "Farm deleted successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
