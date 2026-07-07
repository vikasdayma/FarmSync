

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiBadRequest, apiServerError, apiValidationError } from "@/lib/response";
import { VerifyEmailSchema } from "@/validators/schemas";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = VerifyEmailSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { token } = parsed.data;

        const record = await prisma.emailVerificationToken.findUnique({
            where: { token },
            include: { user: { select: { id: true, emailVerified: true } } },
        });

        if (!record) return apiBadRequest("Invalid verification token");
        if (record.usedAt) return apiBadRequest("Token already used");
        if (record.expiresAt < new Date()) return apiBadRequest("Token has expired. Please request a new one.");
        if (record.user.emailVerified) return apiSuccess(null, "Email already verified");

        await prisma.$transaction([
            prisma.user.update({
                where: { id: record.userId },
                data: { emailVerified: true, emailVerifiedAt: new Date(), status: "ACTIVE" },
            }),
            prisma.emailVerificationToken.update({
                where: { id: record.id },
                data: { usedAt: new Date() },
            }),
        ]);

        return apiSuccess(null, "Email verified successfully. You can now log in.");
    } catch (err) {
        return apiServerError(err);
    }
}
