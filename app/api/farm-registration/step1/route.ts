

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiCreated, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { Step1Schema } from "@/validators/schemas";

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["FARMER", "SUPER_ADMIN"].includes(auth.user.role)) return apiForbidden("Only farmers can register farms");

    try {
        const body = await req.json();
        const parsed = Step1Schema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        
        const session = await prisma.farmRegistrationSession.create({
            data: {
                userId: auth.user.sub,
                currentStep: "STEP_1_BASIC",
                step1Data: parsed.data,
            },
            select: { id: true, currentStep: true, createdAt: true },
        });

        return apiCreated(
            { sessionId: session.id, currentStep: session.currentStep },
            "Step 1 saved. Proceed to Step 2 (Soil Data)"
        );
    } catch (err) {
        return apiServerError(err);
    }
}
