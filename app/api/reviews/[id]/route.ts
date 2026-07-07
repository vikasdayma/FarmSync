

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiBadRequest, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { CreateReviewSchema } from "@/validators/schemas";
import { softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const review = await prisma.review.findFirst({
        where: { id, deletedAt: null },
        include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });
    if (!review) return apiNotFound("Review not found");
    return apiSuccess(review, "Review retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const review = await prisma.review.findFirst({ where: { id, deletedAt: null } });
    if (!review) return apiNotFound("Review not found");
    if (review.userId !== auth.user.sub) return apiForbidden("Can only edit your own reviews");

    
    const createdMsAgo = Date.now() - review.createdAt.getTime();
    if (createdMsAgo > 7 * 24 * 60 * 60 * 1000) {
        return apiBadRequest("Reviews can only be edited within 7 days of posting");
    }

    try {
        const body = await req.json();
        const parsed = CreateReviewSchema.partial().safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);
        const updated = await prisma.review.update({ where: { id }, data: parsed.data });
        return apiSuccess(updated, "Review updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const review = await prisma.review.findFirst({ where: { id, deletedAt: null } });
    if (!review) return apiNotFound("Review not found");
    if (review.userId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();

    await prisma.review.update({ where: { id }, data: softDeletePayload() });
    return apiSuccess(null, "Review deleted");
}
