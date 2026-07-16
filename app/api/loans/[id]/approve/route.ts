

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiBadRequest, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { ReviewLoanSchema } from "@/validators/schemas";
import { enqueueJob } from "@/jobs/queue";
import { notDeleted } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["GOVERNMENT_OFFICER", "SUPER_ADMIN","AGRONOMIST"].includes(auth.user.role)) {
        return apiForbidden("Only government officers and super admins can approve loans");
    }
    const { id } = await params;

    try {
        const body = await req.json();

        const { reviewNotes } = body as { reviewNotes?: string };

        const loan = await prisma.loan.findFirst({
            where: { id, ...notDeleted() },
            include: { user: { select: { id: true, firstName: true, email: true } } },
        });
        if (!loan) return apiNotFound("Loan not found");
        if (!["SUBMITTED", "UNDER_REVIEW"].includes(loan.status)) {
            return apiBadRequest(`Cannot approve loan in "${loan.status}" status`);
        }

        const updated = await prisma.loan.update({
            where: { id },
            data: {
                status: "APPROVED",
                reviewNotes: reviewNotes,
                reviewedBy: auth.user.sub,
                reviewedAt: new Date(),
            },
        });

        await createNotification({
            userId: loan.userId,
            type: "SUCCESS",
            title: "Loan Application Approved! 🎉",
            body: `Your loan application #${loan.appNo} for ₹${loan.loanAmount} has been approved.`,
        });

        await enqueueJob("SEND_LOAN_STATUS_EMAIL", {
            to: loan.user.email,
            firstName: loan.user.firstName,
            status: "APPROVED",
            appNo: loan.appNo,
            reviewNotes,
        });

        await createAuditLog({ actorId: auth.user.sub, action: "APPROVE", entity: "Loan", entityId: id, req, metadata: { reviewNotes } });
        return apiSuccess(updated, "Loan approved successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
