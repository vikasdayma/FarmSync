

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { CreateSoilReportSchema } from "@/validators/schemas";
import { notDeleted, softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

async function getReport(id: string) {
    return prisma.soilReport.findFirst({ where: { id, ...notDeleted() } });
}

function canAccess(userId: string, role: string, reportUserId: string) {
    return reportUserId === userId || ["SUPER_ADMIN", "AGRONOMIST", "GOVERNMENT_OFFICER"].includes(role);
}

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const report = await getReport(id);
    if (!report) return apiNotFound("Soil report not found");
    if (!canAccess(auth.user.sub, auth.user.role, report.userId)) return apiForbidden();

    return apiSuccess(report, "Soil report retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const report = await getReport(id);
    if (!report) return apiNotFound("Soil report not found");
    if (!canAccess(auth.user.sub, auth.user.role, report.userId)) return apiForbidden();

    try {
        const body = await req.json();
        const parsed = CreateSoilReportSchema.partial().safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.soilReport.update({
            where: { id },
            data: { ...parsed.data, testDate: parsed.data.testDate ? new Date(parsed.data.testDate) : undefined },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "SoilReport", entityId: id, oldValue: report as Record<string, unknown>, newValue: updated as Record<string, unknown>, req });
        return apiSuccess(updated, "Soil report updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const report = await getReport(id);
    if (!report) return apiNotFound("Soil report not found");
    if (!canAccess(auth.user.sub, auth.user.role, report.userId)) return apiForbidden();

    await prisma.soilReport.update({ where: { id }, data: softDeletePayload() });
    await createAuditLog({ actorId: auth.user.sub, action: "DELETE", entity: "SoilReport", entityId: id, req });
    return apiSuccess(null, "Soil report deleted");
}
