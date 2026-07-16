

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiBadRequest, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CreateLoanSchema } from "@/validators/schemas";
import { notDeleted, softDeletePayload } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };
const REVIEW_ROLES = ["GOVERNMENT_OFFICER", "SUPER_ADMIN","AGRONOMIST"];

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const loan = await prisma.loan.findFirst({
        where: { id, ...notDeleted() },
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    if (!loan) return apiNotFound("Loan not found");
    if (loan.userId !== auth.user.sub && !REVIEW_ROLES.includes(auth.user.role)) return apiForbidden();
    return apiSuccess(loan, "Loan retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const loan = await prisma.loan.findFirst({ where: { id, ...notDeleted() } });
    if (!loan) return apiNotFound("Loan not found");
    if (loan.userId !== auth.user.sub) return apiForbidden();
    if (loan.status !== "DRAFT") return apiBadRequest("Only DRAFT applications can be edited");

    try {
        const body = await req.json();
        const parsed = CreateLoanSchema.partial().safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const updated = await prisma.loan.update({ where: { id }, data: parsed.data });
        return apiSuccess(updated, "Loan updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const loan = await prisma.loan.findFirst({ where: { id, ...notDeleted() } });
    if (!loan) return apiNotFound("Loan not found");
    if (loan.userId !== auth.user.sub && auth.user.role !== "SUPER_ADMIN") return apiForbidden();
    if (loan.status !== "DRAFT") return apiBadRequest("Only DRAFT applications can be deleted");

    await prisma.loan.update({ where: { id }, data: softDeletePayload() });
    return apiSuccess(null, "Loan application deleted");
}
