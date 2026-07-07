

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { UpdateProfileSchema } from "@/validators/schemas";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    const user = await prisma.user.findUnique({
        where: { id: auth.user.sub },
        select: {
            id: true, firstName: true, lastName: true, email: true, phone: true,
            role: true, status: true, emailVerified: true, avatarUrl: true,
            address: true, city: true, state: true, country: true, pincode: true,
            bio: true, createdAt: true, lastLoginAt: true,
            _count: { select: { farms: true, orders: true, loans: true, subsidies: true } },
        },
    });

    return apiSuccess(user, "Profile retrieved");
}

export async function PUT(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = UpdateProfileSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.user.update({
            where: { id: auth.user.sub },
            data: parsed.data,
            select: {
                id: true, firstName: true, lastName: true, email: true, phone: true,
                bio: true, address: true, city: true, state: true, country: true, pincode: true,
                avatarUrl: true,
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "User", entityId: auth.user.sub, req });
        return apiSuccess(updated, "Profile updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    
    await prisma.$transaction([
        prisma.user.update({
            where: { id: auth.user.sub },
            data: { deletedAt: new Date(), status: "SUSPENDED" },
        }),
        prisma.session.updateMany({
            where: { userId: auth.user.sub },
            data: { isRevoked: true, revokedAt: new Date() },
        }),
    ]);

    await createAuditLog({ actorId: auth.user.sub, action: "DELETE", entity: "User", entityId: auth.user.sub, req });
    return apiSuccess(null, "Account deletion requested. All sessions revoked.");
}
