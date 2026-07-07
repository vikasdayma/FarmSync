

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiBadRequest, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { AdminUpdateUserSchema } from "@/validators/schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (auth.user.role !== "SUPER_ADMIN") return apiForbidden();
    const { id } = await params;

    const user = await prisma.user.findFirst({
        where: { id, deletedAt: null },
        select: {
            id: true, firstName: true, lastName: true, email: true, phone: true,
            role: true, status: true, emailVerified: true, lastLoginAt: true, createdAt: true,
            farms: { select: { id: true, name: true, status: true }, take: 10 },
            _count: { select: { farms: true, orders: true, loans: true, subsidies: true } },
        },
    });

    if (!user) return apiNotFound("User not found");
    return apiSuccess(user, "User retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (auth.user.role !== "SUPER_ADMIN") return apiForbidden();
    const { id } = await params;

    
    if (id === auth.user.sub) return apiBadRequest("Cannot modify your own account via admin endpoint");

    try {
        const body = await req.json();
        const parsed = AdminUpdateUserSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.user.update({
            where: { id },
            data: parsed.data,
            select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "User", entityId: id, req, metadata: parsed.data });
        return apiSuccess(updated, "User updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (auth.user.role !== "SUPER_ADMIN") return apiForbidden();
    const { id } = await params;

    if (id === auth.user.sub) return apiBadRequest("Cannot delete your own account");

    await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date(), status: "SUSPENDED" },
    });

    await createAuditLog({ actorId: auth.user.sub, action: "DELETE", entity: "User", entityId: id, req });
    return apiSuccess(null, "User soft-deleted and suspended");
}
