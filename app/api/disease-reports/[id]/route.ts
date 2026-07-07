

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";
import { UpdateDiseaseReportSchema } from "@/validators/schemas";
import { notDeleted, softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const report = await prisma.diseaseReport.findFirst({
        where: { id, ...notDeleted() },
        include: {
            farm: { select: { id: true, name: true, city: true } },
            user: { select: { id: true, firstName: true, lastName: true } },
        },
    });
    if (!report) return apiNotFound("Disease report not found");
    if (report.userId !== auth.user.sub && !["SUPER_ADMIN", "AGRONOMIST", "GOVERNMENT_OFFICER"].includes(auth.user.role)) {
        return apiForbidden();
    }
    return apiSuccess(report, "Disease report retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const report = await prisma.diseaseReport.findFirst({ where: { id, ...notDeleted() } });
    if (!report) return apiNotFound("Disease report not found");
    if (report.userId !== auth.user.sub && !["SUPER_ADMIN", "AGRONOMIST"].includes(auth.user.role)) {
        return apiForbidden();
    }

    try {
        const body = await req.json();
        const parsed = UpdateDiseaseReportSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.diseaseReport.update({
            where: { id },
            data: {
                ...parsed.data,
                resolvedAt: parsed.data.status === "RESOLVED" ? new Date() : undefined,
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "UPDATE", entity: "DiseaseReport", entityId: id, oldValue: report as Record<string, unknown>, newValue: updated as Record<string, unknown>, req });
        return apiSuccess(updated, "Disease report updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const report = await prisma.diseaseReport.findFirst({ where: { id, ...notDeleted() } });
    if (!report) return apiNotFound("Disease report not found");
    if (report.userId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();

    await prisma.diseaseReport.update({ where: { id }, data: softDeletePayload() });
    return apiSuccess(null, "Disease report deleted");
}
