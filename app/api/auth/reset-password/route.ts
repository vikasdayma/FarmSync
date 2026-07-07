

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiBadRequest, apiServerError, apiValidationError } from "@/lib/response";
import { ResetPasswordSchema } from "@/validators/schemas";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = ResetPasswordSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { token, password } = parsed.data;

        const record = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: { select: { id: true, deletedAt: true } } },
        });

        if (!record || !record.user || record.user.deletedAt) {
            return apiBadRequest("Invalid reset token");
        }
        if (record.usedAt) return apiBadRequest("This reset link has already been used");
        if (record.expiresAt < new Date()) return apiBadRequest("Reset link has expired. Please request a new one.");

        const passwordHash = await bcrypt.hash(password, 12);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: record.userId },
                data: { passwordHash, passwordChangedAt: new Date() },
            }),
            prisma.passwordResetToken.update({
                where: { id: record.id },
                data: { usedAt: new Date() },
            }),

            prisma.session.updateMany({
                where: { userId: record.userId },
                data: { isRevoked: true, revokedAt: new Date() },
            }),
        ]);

        return apiSuccess(null, "Password reset successful. Please log in with your new password.");
    } catch (err) {
        return apiServerError(err);
    }
}
