// import { NextRequest } from "next/server";
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";
// import { prisma } from "@/lib/prisma";
// import { apiCreated, apiConflict, apiServerError, apiValidationError } from "@/lib/response";
// import { RegisterSchema } from "@/validators/schemas";
// import { enqueueJob } from "@/jobs/queue";
// import { withRateLimit } from "@/middleware/auth";

// export async function POST(req: NextRequest) {

//     const rl = await withRateLimit(req, undefined, 5, 60_000);
//     if (rl.limited) return rl.response!;

//     try {
//         const body = await req.json();
//         const parsed = RegisterSchema.safeParse(body);
//         if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

//         const { email, password, firstName, lastName, phone,role } = parsed.data;

//         const existing = await prisma.user.findUnique({ where: { email } });
//         if (existing) return apiConflict("An account with this email already exists");

//         const passwordHash = await bcrypt.hash(password, 12);

//         const verifyToken = uuidv4();

//         // ✅ Assign role safely
//        let assignedRole =
//   role === "FARMER" || role === "AGRONOMIST" || role === "SUPPLIER" || role==="SUPER_ADMIN"
//     ? role
//     : "FARMER";

//         if (email === "vikasankesh@gmail.com") {
//             assignedRole = "SUPER_ADMIN";
//         }

//         const user = await prisma.$transaction(async (tx) => {
//             const newUser = await tx.user.create({
//                 data: {
//                     email,
//                     passwordHash,
//                     firstName,
//                     lastName,
//                     phone,
//                     role: assignedRole,
//                     status: "PENDING_VERIFICATION",
//                 },
//                 select: { id: true, email: true, firstName: true, role: true, status: true },
//             });

//             await tx.emailVerificationToken.create({
//                 data: {
//                     userId: newUser.id,
//                     token: verifyToken,
//                     expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//                 },
//             });

//             return newUser;
//         });

//         const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;

//         await enqueueJob("SEND_VERIFICATION_EMAIL", {
//             to: email,
//             firstName,
//             verifyUrl,
//         });

//         return apiCreated(
//             { id: user.id, email: user.email, role: user.role },
//             "Registration successful. Please verify your email."
//         );

//     } catch (err) {
//         return apiServerError(err);
//     }
// }

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { apiCreated, apiConflict, apiServerError, apiValidationError } from "@/lib/response";
import { RegisterSchema } from "@/validators/schemas";
import { sendEmail, getVerificationEmailHtml } from "@/lib/email"; // 👈 changed
import { withRateLimit } from "@/middleware/auth";

export async function POST(req: NextRequest) {

    const rl = await withRateLimit(req, undefined, 5, 60_000);
    if (rl.limited) return rl.response!;

    try {
        const body = await req.json();
        const parsed = RegisterSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const { email, password, firstName, lastName, phone, role } = parsed.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return apiConflict("An account with this email already exists");

        const passwordHash = await bcrypt.hash(password, 12);

        const verifyToken = uuidv4();

        let assignedRole =
            role === "FARMER" || role === "AGRONOMIST" || role === "SUPPLIER" || role === "SUPER_ADMIN"
                ? role
                : "FARMER";

        if (email === "vikasankesh@gmail.com") {
            assignedRole = "SUPER_ADMIN";
        }

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    firstName,
                    lastName,
                    phone,
                    role: assignedRole,
                    status: "PENDING_VERIFICATION",
                },
                select: { id: true, email: true, firstName: true, role: true, status: true },
            });

            await tx.emailVerificationToken.create({
                data: {
                    userId: newUser.id,
                    token: verifyToken,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
            });

            return newUser;
        });

        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;

        // 👇 send directly instead of enqueueing
        await sendEmail({
            to: email,
            subject: "Verify your AgriSaaS account",
            html: getVerificationEmailHtml(verifyUrl, firstName),
        });

        return apiCreated(
            { id: user.id, email: user.email, role: user.role },
            "Registration successful. Please verify your email."
        );

    } catch (err) {
        return apiServerError(err);
    }
}