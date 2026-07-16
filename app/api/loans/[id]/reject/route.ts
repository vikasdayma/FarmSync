

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiBadRequest, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { enqueueJob } from "@/jobs/queue";
import { notDeleted } from "@/lib/response";
export function serializeLoan<T extends { loanAmount: unknown }>(loan: T) {
  return {
    ...loan,
    loanAmount: (loan.loanAmount as any).toString(),
  };
}
type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["GOVERNMENT_OFFICER", "SUPER_ADMIN","AGRONOMIST"].includes(auth.user.role)) {
        return apiForbidden("Only government officers can reject loans");
    }
    const { id } = await params;

    try {
        const { reviewNotes } = await req.json() as { reviewNotes: string };
        if (!reviewNotes || reviewNotes.length < 10) {
            return apiBadRequest("Rejection requires a review note (min 10 characters)");
        }

        const loan = await prisma.loan.findFirst({
            where: { id, ...notDeleted() },
            include: { user: { select: { id: true, firstName: true, email: true } } },
        });
        if (!loan) return apiNotFound("Loan not found");
        if (!["SUBMITTED", "UNDER_REVIEW"].includes(loan.status)) {
            return apiBadRequest(`Cannot reject loan in "${loan.status}" status`);
        }

        const updated = await prisma.loan.update({
            where: { id },
            data: { status: "REJECTED", reviewNotes, reviewedBy: auth.user.sub, reviewedAt: new Date() },
        });

        await createNotification({
            userId: loan.userId,
            type: "ERROR",
            title: "Loan Application Rejected",
            body: `Your loan application #${loan.appNo} has been rejected. Reason: ${reviewNotes}`,
        });

        await enqueueJob("SEND_LOAN_STATUS_EMAIL", {
            to: loan.user.email, firstName: loan.user.firstName,
            status: "REJECTED", appNo: loan.appNo, reviewNotes,
        });

        await createAuditLog({ actorId: auth.user.sub, action: "REJECT", entity: "Loan", entityId: id, req });
        return apiSuccess(updated, "Loan application rejected");
    } catch (err) {
        return apiServerError(err);
    }
}
