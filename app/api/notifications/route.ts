

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiServerError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { getPagination, buildMeta } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const unreadOnly = searchParams.get("unread") === "true";

    const where = {
        userId: auth.user.sub,
        ...(unreadOnly && { isRead: false }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({ where: { userId: auth.user.sub, isRead: false } }),
    ]);

    return apiSuccess(notifications, "Notifications retrieved", {
        ...buildMeta(total, page, limit),
        unreadCount,
    });
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        await prisma.notification.updateMany({
            where: { userId: auth.user.sub, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
        return apiSuccess(null, "All notifications marked as read");
    } catch (err) {
        return apiServerError(err);
    }
}
