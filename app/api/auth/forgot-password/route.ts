

import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiServerError, apiValidationError } from "@/lib/response";
import { ForgotPasswordSchema } from "@/validators/schemas";
import { enqueueJob } from "@/jobs/queue";
import { withRateLimit } from "@/middleware/auth";

export async function POST(req: NextRequest) {

    const rl = await withRateLimit(req, undefined, 3, 5 * 60_000);
    if (rl.limited) return rl.response!;

    try {
        const body = await req.json();
        const parsed = ForgotPasswordSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { email } = parsed.data;

        
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, firstName: true, deletedAt: true },
        });

        if (user && !user.deletedAt) {

            await prisma.passwordResetToken.updateMany({
                where: { userId: user.id, usedAt: null },
                data: { usedAt: new Date() },
            });

            const token = uuidv4();
            await prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    token,
                    expiresAt: new Date(Date.now() + 60 * 60 * 1000), 
                },
            });

            const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
            await enqueueJob("SEND_RESET_PASSWORD_EMAIL", {
                to: email,
                firstName: user.firstName,
                resetUrl,
            });
        }

        return apiSuccess(null, "If an account with that email exists, you will receive a password reset link shortly.");
    } catch (err) {
        return apiServerError(err);
    }
}
