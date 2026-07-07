

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { Step5Schema } from "@/validators/schemas";

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = Step5Schema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { sessionId, ...step5Data } = parsed.data;
        const session = await prisma.farmRegistrationSession.findFirst({
            where: { id: sessionId, userId: auth.user.sub, isCompleted: false },
        });
        if (!session) return apiNotFound("Registration session not found");

        const updated = await prisma.farmRegistrationSession.update({
            where: { id: sessionId },
            data: { step5Data, currentStep: "STEP_5_FERTILIZER" },
            select: { id: true, currentStep: true },
        });

        return apiSuccess(
            { sessionId: updated.id, currentStep: updated.currentStep },
            "Step 5 (Fertilizer Plan) saved. Proceed to Step 6 (Financial Planning)"
        );
    } catch (err) {
        return apiServerError(err);
    }
}
