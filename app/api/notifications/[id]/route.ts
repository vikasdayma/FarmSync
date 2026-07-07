

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return apiNotFound("Notification not found");
    if (notification.userId !== auth.user.sub) return apiForbidden();

    const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true, readAt: new Date() },
    });
    return apiSuccess(updated, "Notification marked as read");
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return apiNotFound("Notification not found");
    if (notification.userId !== auth.user.sub) return apiForbidden();

    await prisma.notification.delete({ where: { id } });
    return apiSuccess(null, "Notification deleted");
}
