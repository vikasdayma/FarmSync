

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiBadRequest, apiForbidden, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { Step2Schema } from "@/validators/schemas";

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = Step2Schema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { sessionId, ...step2Data } = parsed.data;
        const session = await prisma.farmRegistrationSession.findFirst({
            where: { id: sessionId, userId: auth.user.sub, isCompleted: false },
        });

        if (!session) return apiNotFound("Registration session not found");

        const updated = await prisma.farmRegistrationSession.update({
            where: { id: sessionId },
            data: { step2Data, currentStep: "STEP_2_SOIL" },
            select: { id: true, currentStep: true },
        });

        return apiSuccess(
            { sessionId: updated.id, currentStep: updated.currentStep },
            "Step 2 (Soil Data) saved. Proceed to Step 3 (Crop Selection)"
        );
    } catch (err) {
        return apiServerError(err);
    }
}
