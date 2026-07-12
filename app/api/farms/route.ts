

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiServerError, apiValidationError, apiForbidden } from "@/lib/response";
import { getAuthUser, createAuditLog, withRateLimit } from "@/middleware/auth";
import { CreateFarmSchema } from "@/validators/schemas";
import { getPagination, buildMeta, getSortOrder, notDeleted } from "@/lib/response";
import { cacheGet, cacheSet, cacheDel } from "@/lib/redis";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const sortOrder = getSortOrder(searchParams, ["name", "areaHectares", "createdAt"]);

    
    const isAdmin = ["SUPER_ADMIN", "GOVERNMENT_OFFICER","AGRONOMIST"].includes(auth.user.role);
    const ownerFilter = isAdmin ? {} : { ownerId: auth.user.sub };

    const cacheKey = `farms:${auth.user.sub}:${auth.user.role}:p${page}:l${limit}:s:${search}:st:${status}`;
    const cached = await cacheGet<{ data: unknown; meta: unknown }>(cacheKey);
    if (cached) return apiSuccess(cached.data, "Farms retrieved (cached)", cached.meta as Record<string, unknown>);

    const where = {
        ...notDeleted(),
        ...ownerFilter,
        ...(status && { status: status as never }),
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { city: { contains: search, mode: "insensitive" as const } },
                { state: { contains: search, mode: "insensitive" as const } },
            ],
        }),
    };

    const [farms, total] = await Promise.all([
        prisma.farm.findMany({
            where,
            skip,
            take: limit,
            orderBy: sortOrder,
            select: {
                id: true, name: true, status: true, areaHectares: true,
                city: true, state: true, soilType: true, irrigationType: true,
                isVerified: true, createdAt: true,
                owner: { select: { id: true, firstName: true, lastName: true, email: true } },
                _count: { select: { cropCycles: true, soilReports: true } },
            },
        }),
        prisma.farm.count({ where }),
    ]);

    const meta = buildMeta(total, page, limit);
    await cacheSet(cacheKey, { data: farms, meta }, 120); 

    return apiSuccess(farms, "Farms retrieved", meta);
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    if (!["FARMER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only farmers can create farms");
    }

    const rl = await withRateLimit(req, auth.user.sub, 10, 60_000);
    if (rl.limited) return rl.response!;

    try {
        const body = await req.json();
        const parsed = CreateFarmSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const farm = await prisma.farm.create({
            data: { ...parsed.data, ownerId: auth.user.sub },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Farm", entityId: farm.id, newValue: farm as Record<string, unknown>, req });
        await cacheDel(`farms:${auth.user.sub}:*`);

        return apiCreated(farm, "Farm created successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
