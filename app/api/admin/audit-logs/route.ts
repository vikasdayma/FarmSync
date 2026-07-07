

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { getPagination, buildMeta } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (auth.user.role !== "SUPER_ADMIN") return apiForbidden("Super admin access required");

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const actorId = searchParams.get("actorId");
    const entity = searchParams.get("entity");
    const action = searchParams.get("action");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where = {
        ...(actorId && { actorId }),
        ...(entity && { entity }),
        ...(action && { action }),
        ...(from && { createdAt: { gte: new Date(from) } }),
        ...(to && { createdAt: { ...(from ? { gte: new Date(from) } : {}), lte: new Date(to) } }),
    };

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: { actor: { select: { id: true, firstName: true, lastName: true, email: true, role: true } } },
        }),
        prisma.auditLog.count({ where }),
    ]);

    return apiSuccess(logs, "Audit logs retrieved", buildMeta(total, page, limit));
}
