

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { AdminUpdateUserSchema } from "@/validators/schemas";
import { getPagination, buildMeta } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (auth.user.role !== "SUPER_ADMIN") return apiForbidden("Super admin access required");

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const where = {
        deletedAt: null,
        ...(role && { role: role as never }),
        ...(status && { status: status as never }),
        ...(search && {
            OR: [
                { firstName: { contains: search, mode: "insensitive" as const } },
                { lastName: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
                { phone: { contains: search, mode: "insensitive" as const } },
            ]
        }),
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true, firstName: true, lastName: true, email: true, phone: true,
                role: true, status: true, emailVerified: true, lastLoginAt: true,
                createdAt: true, _count: { select: { farms: true, orders: true } },
            },
        }),
        prisma.user.count({ where }),
    ]);

    return apiSuccess(users, "Users retrieved", buildMeta(total, page, limit));
}
