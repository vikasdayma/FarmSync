

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiCreated, apiBadRequest, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser, createAuditLog, createNotification } from "@/middleware/auth";
import { SubmitRegistrationSchema } from "@/validators/schemas";

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const body = await req.json();
        const parsed = SubmitRegistrationSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { sessionId } = parsed.data;
        const session = await prisma.farmRegistrationSession.findFirst({
            where: { id: sessionId, userId: auth.user.sub, isCompleted: false },
        });

        if (!session) return apiNotFound("Registration session not found");
        if (!session.step1Data || !session.step2Data || !session.step3Data ||
            !session.step4Data || !session.step5Data || !session.step6Data) {
            return apiBadRequest(
                "Incomplete registration. Please complete all 6 steps before submitting.",
                {
                    missingSteps: [
                        !session.step1Data && "Step 1 (Basic Info)",
                        !session.step2Data && "Step 2 (Soil Data)",
                        !session.step3Data && "Step 3 (Crop Selection)",
                        !session.step4Data && "Step 4 (Irrigation Plan)",
                        !session.step5Data && "Step 5 (Fertilizer Plan)",
                        !session.step6Data && "Step 6 (Financial Planning)",
                    ].filter(Boolean),
                }
            );
        }

        const s1 = session.step1Data as Record<string, unknown>;
        const s2 = session.step2Data as Record<string, unknown>;
        const s3 = session.step3Data as Record<string, unknown>;
        const s4 = session.step4Data as Record<string, unknown>;

        
        const result = await prisma.$transaction(async (tx) => {
            const farm = await tx.farm.create({
                data: {
                    ownerId: auth.user.sub,
                    name: s1.name as string,
                    areaHectares: s1.areaHectares as number,
                    address: s1.address as string,
                    city: s1.city as string,
                    state: s1.state as string,
                    country: (s1.country as string) ?? "India",
                    pincode: s1.pincode as string,
                    latitude: s1.latitude as number | undefined,
                    longitude: s1.longitude as number | undefined,
                    soilType: s2.soilType as never,
                    waterSource: s4.waterSource as string,
                    irrigationType: s4.irrigationType as never,
                },
            });

            await tx.soilReport.create({
                data: {
                    farmId: farm.id,
                    userId: auth.user.sub,
                    testDate: new Date(),
                    phLevel: s2.phLevel as number,
                    nitrogenPpm: s2.nitrogenPpm as number | undefined,
                    phosphorusPpm: s2.phosphorusPpm as number | undefined,
                    potassiumPpm: s2.potassiumPpm as number | undefined,
                    organicMatter: s2.organicMatter as number | undefined,
                    moistureLevel: s2.moistureLevel as number | undefined,
                    soilType: s2.soilType as never,
                    labName: s2.labName as string | undefined,
                },
            });

            await tx.cropCycle.create({
                data: {
                    farmId: farm.id,
                    cropId: s3.cropId as string,
                    userId: auth.user.sub,
                    season: s3.season as string,
                    year: s3.year as number,
                    plantingDate: s3.plantingDate ? new Date(s3.plantingDate as string) : undefined,
                    harvestDate: s3.harvestDate ? new Date(s3.harvestDate as string) : undefined,
                    expectedYieldKg: s3.expectedYieldKg as number | undefined,
                    status: "PLANNED",
                },
            });

            
            await tx.farmRegistrationSession.update({
                where: { id: sessionId },
                data: { isCompleted: true, completedAt: new Date(), farmId: farm.id, currentStep: "SUBMITTED" },
            });

            return farm;
        });

        await createAuditLog({ actorId: auth.user.sub, action: "CREATE", entity: "Farm", entityId: result.id, req });
        await createNotification({
            userId: auth.user.sub,
            type: "SUCCESS",
            title: "Farm Registration Complete",
            body: `Your farm "${result.name}" has been registered successfully!`,
        });

        return apiCreated({ farmId: result.id, farmName: result.name }, "Farm registration completed successfully!");
    } catch (err) {
        return apiServerError(err);
    }
}
