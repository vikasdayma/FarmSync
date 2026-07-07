import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    const user = await prisma.user.findUnique({
        where: { id: auth.user.sub },
       select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    avatarUrl: true,  
    role: true,
    emailVerified: true,
    createdAt: true,
}
    });

    if (!user) return apiNotFound("User not found");

    return apiSuccess(user, "User fetched successfully");
}