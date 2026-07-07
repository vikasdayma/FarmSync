// app/api/marketplace/my-listings/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { getPagination, buildMeta, notDeleted, getSortOrder } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    if (!["FARMER", "SUPPLIER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only farmers and suppliers can view their listings");
    }

    try {
        const { searchParams } = new URL(req.url);
        const { page, limit, skip } = getPagination(searchParams);
        const status = searchParams.get("status"); // optional filter: ACTIVE, INACTIVE, SOLD_OUT, EXPIRED

        const where = {
            sellerId: auth.user.sub,   // ← only this user's listings
            ...notDeleted(),
            ...(status && { status: status as any }),
        };

        const [listings, total] = await Promise.all([
            prisma.marketplaceListing.findMany({
                where,
                skip,
                take: limit,
                orderBy: getSortOrder(searchParams, ["createdAt", "pricePerUnit"]),
                include: {
                    _count: { select: { reviews: true } },
                },
            }),
            prisma.marketplaceListing.count({ where }),
        ]);

        const meta = buildMeta(total, page, limit);
        return apiSuccess(listings, "Your listings retrieved", meta);
    } catch (err) {
        return apiServerError(err);
    }
}