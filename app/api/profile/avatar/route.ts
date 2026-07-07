

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiBadRequest, apiServerError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) return apiBadRequest("No file provided");
        if (!file.type.startsWith("image/")) return apiBadRequest("Only image files are allowed");
        if (file.size > 5 * 1024 * 1024) return apiBadRequest("File size must be under 5 MB");

        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        const result = await uploadToCloudinary(base64, {
            folder: `agri-saas/avatars`,
            public_id: auth.user.sub,
            transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
        });

        const user = await prisma.user.update({
            where: { id: auth.user.sub },
            data: { avatarUrl: result.url },
            select: { id: true, avatarUrl: true },
        });

        return apiSuccess(user, "Avatar uploaded successfully");
    } catch (err) {
        return apiServerError(err);
    }
}
