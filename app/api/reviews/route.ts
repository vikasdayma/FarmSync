

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiNotFound, apiBadRequest, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { CreateReviewSchema } from "@/validators/schemas";
import { getPagination, buildMeta, softDeletePayload } from "@/lib/response";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const listingId = searchParams.get("listingId");
    const reviewedId = searchParams.get("reviewedId");

    const where = {
        deletedAt: null,
        ...(listingId && { listingId }),
        ...(reviewedId && { reviewedId }),
    };

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        }),
        prisma.review.count({ where }),
    ]);

    return apiSuccess(reviews, "Reviews retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = CreateReviewSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        
        const existing = await prisma.review.findFirst({
            where: { userId: auth.user.sub, listingId: parsed.data.listingId, deletedAt: null },
        });
        if (existing) return apiBadRequest("You have already reviewed this listing");

        const review = await prisma.review.create({
            data: { ...parsed.data, userId: auth.user.sub },
        });
        return apiCreated(review, "Review submitted");
    } catch (err) {
        return apiServerError(err);
    }
}
