

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { Step3Schema } from "@/validators/schemas";

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = Step3Schema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { sessionId, ...step3Data } = parsed.data;
        const session = await prisma.farmRegistrationSession.findFirst({
            where: { id: sessionId, userId: auth.user.sub, isCompleted: false },
        });
        if (!session) return apiNotFound("Registration session not found");

        
        const crop = await prisma.crop.findUnique({ where: { id: step3Data.cropId } });
        if (!crop) return apiNotFound("Selected crop not found");

        const updated = await prisma.farmRegistrationSession.update({
            where: { id: sessionId },
            data: { step3Data, currentStep: "STEP_3_CROP" },
            select: { id: true, currentStep: true },
        });

        return apiSuccess(
            { sessionId: updated.id, currentStep: updated.currentStep },
            "Step 3 (Crop Selection) saved. Proceed to Step 4 (Irrigation Plan)"
        );
    } catch (err) {
        return apiServerError(err);
    }
}
