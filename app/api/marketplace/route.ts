

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateMarketplaceListingSchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted, getSortOrder } from "@/lib/response";
import { cacheGet, cacheSet } from "@/lib/redis";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const cacheKey = `marketplace:p${page}:l${limit}:s:${search}:cat:${category}:loc:${location}:min:${minPrice}:max:${maxPrice}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return apiSuccess((cached as Record<string, unknown>).data, "Listings (cached)", (cached as Record<string, unknown>).meta as Record<string, unknown>);

    const where = {
        status: "ACTIVE" as const,
        ...notDeleted(),
        ...(category && { category }),
        ...(location && { location: { contains: location, mode: "insensitive" as const } }),
        ...(minPrice && { pricePerUnit: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { pricePerUnit: { lte: parseFloat(maxPrice) } }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { description: { contains: search, mode: "insensitive" as const } },
                { category: { contains: search, mode: "insensitive" as const } },
            ]
        }),
    };

    const [listings, total] = await Promise.all([
        prisma.marketplaceListing.findMany({
            where, skip, take: limit,
            orderBy: getSortOrder(searchParams, ["createdAt", "pricePerUnit"]),
            include: {
                seller: { select: { id: true, firstName: true, lastName: true } },
                _count: { select: { reviews: true } },
            },
        }),
        prisma.marketplaceListing.count({ where }),
    ]);

    const meta = buildMeta(total, page, limit);
    await cacheSet(cacheKey, { data: listings, meta }, 180);
    return apiSuccess(listings, "Marketplace listings retrieved", meta);
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["FARMER", "SUPPLIER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only farmers and suppliers can create listings");
    }

    try {
        const body = await req.json();
        const parsed = CreateMarketplaceListingSchema.safeParse(body); 
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const listing = await prisma.marketplaceListing.create({
            data: {
                ...parsed.data,
                sellerId: auth.user.sub,
                imageUrls: parsed.data.imageUrls ?? [],
                expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "MarketplaceListing", entityId: listing.id, req });
        return apiCreated(listing, "Listing created successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
