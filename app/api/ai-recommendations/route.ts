

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CreateRecommendationSchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const farmId = searchParams.get("farmId");
    const type = searchParams.get("type");
    const isAdmin = ["SUPER_ADMIN", "AGRONOMIST", "GOVERNMENT_OFFICER"].includes(auth.user.role);

    const where = {
        ...notDeleted(),
        ...(farmId && { farmId }),
        ...(type && { type: type as never }),
        ...(!isAdmin && { userId: auth.user.sub }),
    };

    const [recs, total] = await Promise.all([
        prisma.aIRecommendation.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                farm: { select: { id: true, name: true } },
                agronomist: { select: { id: true, firstName: true, lastName: true } },
            },
        }),
        prisma.aIRecommendation.count({ where }),
    ]);

    return apiSuccess(recs, "Recommendations retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["AGRONOMIST", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only agronomists can create recommendations");
    }

    try {
        const body = await req.json();
        const parsed = CreateRecommendationSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const rec = await prisma.aIRecommendation.create({
            data: { ...parsed.data, agronomistId: auth.user.sub },
        });

        
        const farm = await prisma.farm.findUnique({ where: { id: rec.farmId }, select: { ownerId: true } });
        if (farm) {
            await createNotification({
                userId: farm.ownerId,
                type: "INFO",
                title: "New Recommendation",
                body: `An agronomist has provided a new "${rec.type}" recommendation for your farm.`,
                metadata: { recommendationId: rec.id },
            });
        }

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "AIRecommendation", entityId: rec.id, req });
        return apiCreated(rec, "Recommendation created");
    } catch (err) {
        return apiServerError(err);
    }
}
