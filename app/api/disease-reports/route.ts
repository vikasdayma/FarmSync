

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CreateDiseaseReportSchema, UpdateDiseaseReportSchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted, softDeletePayload } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");
    const farmId = searchParams.get("farmId");
    const isAdmin = ["SUPER_ADMIN", "GOVERNMENT_OFFICER", "AGRONOMIST"].includes(auth.user.role);

    const where = {
        ...notDeleted(),
        ...(farmId && { farmId }),
        ...(status && { status: status as never }),
        ...(!isAdmin && { userId: auth.user.sub }),
    };

    const [reports, total] = await Promise.all([
        prisma.diseaseReport.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                farm: { select: { id: true, name: true } },
                user: { select: { id: true, firstName: true, lastName: true } },
            },
        }),
        prisma.diseaseReport.count({ where }),
    ]);

    return apiSuccess(reports, "Disease reports retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = CreateDiseaseReportSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const report = await prisma.diseaseReport.create({
            data: { ...parsed.data, userId: auth.user.sub, imageUrls: parsed.data.imageUrls ?? [] },
        });

        
        if (parsed.data.severity >= 4) {
            const agronomists = await prisma.user.findMany({
                where: { role: "AGRONOMIST", status: "ACTIVE" },
                select: { id: true },
            });
            await prisma.notification.createMany({
                data: agronomists.map((a) => ({
                    userId: a.id,
                    type: "WARNING" as const,
                    title: "High-Severity Disease Alert",
                    body: `Severity ${parsed.data.severity}/5 disease "${parsed.data.diseaseName}" on crop "${parsed.data.affectedCrop}" reported.`,
                    metadata: { diseaseReportId: report.id },
                })),
            });
        }

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "DiseaseReport", entityId: report.id, req });
        return apiCreated(report, "Disease report created");
    } catch (err) {
        return apiServerError(err);
    }
}
