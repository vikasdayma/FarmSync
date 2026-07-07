

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateSoilReportSchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted, getSortOrder } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const farmId = searchParams.get("farmId");

    const isAdmin = ["SUPER_ADMIN", "GOVERNMENT_OFFICER", "AGRONOMIST"].includes(auth.user.role);
    const where = {
        ...notDeleted(),
        ...(farmId ? { farmId } : {}),
        ...(!isAdmin ? { userId: auth.user.sub } : {}),
    };

    const [reports, total] = await Promise.all([
        prisma.soilReport.findMany({
            where, skip, take: limit,
            orderBy: getSortOrder(searchParams, ["testDate", "phLevel", "createdAt"]),
            include: {
                farm: { select: { id: true, name: true } },
                user: { select: { id: true, firstName: true, lastName: true } },
            },
        }),
        prisma.soilReport.count({ where }),
    ]);

    return apiSuccess(reports, "Soil reports retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["FARMER", "AGRONOMIST", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Insufficient permissions to create soil reports");
    }

    try {
        const body = await req.json();
        const parsed = CreateSoilReportSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const report = await prisma.soilReport.create({
            data: {
                ...parsed.data,
                userId: auth.user.sub,
                testDate: new Date(parsed.data.testDate),
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "SoilReport", entityId: report.id, req });
        return apiCreated(report, "Soil report created successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
