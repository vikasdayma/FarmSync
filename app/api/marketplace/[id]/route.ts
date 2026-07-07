

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { CreateMarketplaceListingSchema } from "@/validators/schemas";
import { notDeleted, softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const listing = await prisma.marketplaceListing.findFirst({
        where: { id, status: "ACTIVE", ...notDeleted() },
        include: {
            seller: { select: { id: true, firstName: true, lastName: true } },
            reviews: {
                where: { deletedAt: null },
                orderBy: { createdAt: "desc" },
                take: 5,
                include: { user: { select: { id: true, firstName: true } } },
            },
            _count: { select: { reviews: true } },
        },
    });
    if (!listing) return apiNotFound("Listing not found");
    return apiSuccess(listing, "Listing retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const listing = await prisma.marketplaceListing.findFirst({ where: { id, ...notDeleted() } });
    if (!listing) return apiNotFound("Listing not found");
    if (listing.sellerId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();

    try {
        const body = await req.json();
        const parsed = CreateMarketplaceListingSchema.partial().safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.marketplaceListing.update({
            where: { id },
            data: { ...parsed.data, expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined },
        });
        return apiSuccess(updated, "Listing updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const listing = await prisma.marketplaceListing.findFirst({ where: { id, ...notDeleted() } });
    if (!listing) return apiNotFound("Listing not found");
    if (listing.sellerId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();

    await prisma.marketplaceListing.update({ where: { id }, data: { ...softDeletePayload(), status: "REMOVED" } });
    return apiSuccess(null, "Listing removed");
}
