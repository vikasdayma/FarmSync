

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateCropCycleSchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id: cropId } = await params;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);

    const crop = await prisma.crop.findUnique({ where: { id: cropId } });
    if (!crop) return apiNotFound("Crop not found");

    const where = {
        cropId,
        ...notDeleted(),
        ...(auth.user.role === "FARMER" ? { userId: auth.user.sub } : {}),
    };

    const [cycles, total] = await Promise.all([
        prisma.cropCycle.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                farm: { select: { id: true, name: true, city: true, state: true } },
            },
        }),
        prisma.cropCycle.count({ where }),
    ]);

    return apiSuccess(cycles, "Crop cycles retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["FARMER", "AGRONOMIST", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only farmers and agronomists can create crop cycles");
    }

    const { id: cropId } = await params;
    const crop = await prisma.crop.findUnique({ where: { id: cropId } });
    if (!crop || !crop.isActive) return apiNotFound("Crop not found");

    try {
        const body = await req.json();
        const parsed = CreateCropCycleSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        
        const farm = await prisma.farm.findFirst({
            where: { id: parsed.data.cropId, ownerId: auth.user.sub, ...notDeleted() },
        });

        const cycle = await prisma.cropCycle.create({
            data: {
                ...parsed.data,
                cropId,
                userId: auth.user.sub,
                farmId: parsed.data.cropId, 
                plantingDate: parsed.data.plantingDate ? new Date(parsed.data.plantingDate) : undefined,
                harvestDate: parsed.data.harvestDate ? new Date(parsed.data.harvestDate) : undefined,
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "CropCycle", entityId: cycle.id, req });
        return apiCreated(cycle, "Crop cycle created");
    } catch (err) {
        return apiServerError(err);
    }
}
