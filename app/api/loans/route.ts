

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiBadRequest, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CreateLoanSchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted } from "@/lib/response";
import { enqueueJob } from "@/jobs/queue";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");
    const isAdmin = ["SUPER_ADMIN", "GOVERNMENT_OFFICER"].includes(auth.user.role);

    const where = {
        ...notDeleted(),
        ...(status && { status: status as never }),
        ...(!isAdmin && { userId: auth.user.sub }),
    };

    const [loans, total] = await Promise.all([
        prisma.loan.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
        }),
        prisma.loan.count({ where }),
    ]);

    return apiSuccess(loans, "Loan applications retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["FARMER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only farmers can apply for loans");
    }

    try {
        const body = await req.json();
        const parsed = CreateLoanSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const loan = await prisma.loan.create({
            data: {
                ...parsed.data,
                userId: auth.user.sub,
                status: "SUBMITTED",
                interestRatePct: parsed.data.interestRatePct ?? 7.5,
                documents: parsed.data.documents ?? [],
            },
        });

        
        const officers = await prisma.user.findMany({
            where: { role: "GOVERNMENT_OFFICER", status: "ACTIVE" },
            select: { id: true },
        });
        await prisma.notification.createMany({
            data: officers.map((o) => ({
                userId: o.id,
                type: "INFO" as const,
                title: "New Loan Application",
                body: `Application #${loan.appNo} for ₹${loan.loanAmount} submitted for review.`,
                metadata: { loanId: loan.id },
            })),
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Loan", entityId: loan.id, req });
        return apiCreated(loan, "Loan application submitted successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
