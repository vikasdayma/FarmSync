

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiBadRequest, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { notDeleted } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["GOVERNMENT_OFFICER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only government officers can approve subsidies");
    }
    const { id } = await params;

    try {
        const { approvedAmount, reviewNotes } = await req.json() as { approvedAmount: number; reviewNotes?: string };

        const subsidy = await prisma.subsidy.findFirst({
            where: { id, ...notDeleted() },
            include: { user: { select: { id: true, firstName: true } } },
        });
        if (!subsidy) return apiNotFound("Subsidy not found");
        if (!["SUBMITTED", "UNDER_REVIEW"].includes(subsidy.status)) {
            return apiBadRequest(`Cannot approve subsidy in "${subsidy.status}" status`);
        }

        const updated = await prisma.subsidy.update({
            where: { id },
            data: {
                status: "APPROVED",
                approvedAmount: approvedAmount ?? subsidy.requestedAmount,
                reviewNotes,
                reviewedBy: auth.user.sub,
                reviewedAt: new Date(),
            },
        });

        await createNotification({
            userId: subsidy.userId,
            type: "SUCCESS",
            title: "Subsidy Approved 🎉",
            body: `Your subsidy application #${subsidy.appNo} has been approved for ₹${updated.approvedAmount}.`,
        });

        await createAuditLog({ actorId: auth.user.sub, action: "APPROVE", entity: "Subsidy", entityId: id, req });
        return apiSuccess(updated, "Subsidy approved");
    } catch (err) {
        return apiServerError(err);
    }
}
