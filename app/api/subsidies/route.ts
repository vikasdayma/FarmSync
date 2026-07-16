

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiNotFound, apiBadRequest, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { CreateSubsidySchema } from "@/validators/schemas";
import { getPagination, buildMeta, notDeleted } from "@/lib/response";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");
    const isAdmin = ["SUPER_ADMIN", "GOVERNMENT_OFFICER","AGRONOMIST"].includes(auth.user.role);

    const where = {
        ...notDeleted(),
        ...(status && { status: status as never }),
        ...(!isAdmin && { userId: auth.user.sub }),
    };

    const [subsidies, total] = await Promise.all([
        prisma.subsidy.findMany({
            where, skip, take: limit,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
        }),
        prisma.subsidy.count({ where }),
    ]);

    return apiSuccess(subsidies, "Subsidy applications retrieved", buildMeta(total, page, limit));
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["FARMER", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Only farmers can apply for subsidies");
    }

    try {
        const body = await req.json();
        const parsed = CreateSubsidySchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const subsidy = await prisma.subsidy.create({
            data: {
                ...parsed.data,
                userId: auth.user.sub,
                status: "SUBMITTED",
                documents: parsed.data.documents ?? [],
            },
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Subsidy", entityId: subsidy.id, req });
        return apiCreated(subsidy, "Subsidy application submitted");
    } catch (err) {
        return apiServerError(err);
    }
}
