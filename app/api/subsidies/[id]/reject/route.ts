

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiBadRequest, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { notDeleted } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["GOVERNMENT_OFFICER", "SUPER_ADMIN"].includes(auth.user.role)) return apiForbidden();
    const { id } = await params;

    try {
        const { reviewNotes } = await req.json() as { reviewNotes: string };
        if (!reviewNotes || reviewNotes.length < 10) return apiBadRequest("Rejection reason required (min 10 chars)");

        const subsidy = await prisma.subsidy.findFirst({
            where: { id, ...notDeleted() },
            include: { user: { select: { id: true, firstName: true } } },
        });
        if (!subsidy) return apiNotFound("Subsidy not found");
        if (!["SUBMITTED", "UNDER_REVIEW"].includes(subsidy.status)) {
            return apiBadRequest(`Cannot reject subsidy in "${subsidy.status}" status`);
        }

        const updated = await prisma.subsidy.update({
            where: { id },
            data: { status: "REJECTED", reviewNotes, reviewedBy: auth.user.sub, reviewedAt: new Date() },
        });

        await createNotification({
            userId: subsidy.userId,
            type: "ERROR",
            title: "Subsidy Application Rejected",
            body: `Your subsidy application #${subsidy.appNo} was rejected. Reason: ${reviewNotes}`,
        });

        await createAuditLog({ actorId: auth.user.sub, action: "REJECT", entity: "Subsidy", entityId: id, req });
        return apiSuccess(updated, "Subsidy rejected");
    } catch (err) {
        return apiServerError(err);
    }
}
