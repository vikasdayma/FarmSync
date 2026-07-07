

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiNotFound, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { CreateCropSchema } from "@/validators/schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const crop = await prisma.crop.findUnique({ where: { id } });
    if (!crop || !crop.isActive) return apiNotFound("Crop not found");
    return apiSuccess(crop, "Crop retrieved");
}

export async function PUT(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["SUPER_ADMIN", "AGRONOMIST"].includes(auth.user.role)) {
        return apiForbidden("Only admins and agronomists can update crops");
    }
    const { id } = await params;

    try {
        const body = await req.json();
        const parsed = CreateCropSchema.partial().safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const crop = await prisma.crop.update({ where: { id }, data: parsed.data });
        return apiSuccess(crop, "Crop updated");
    } catch (err) {
        return apiServerError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (auth.user.role !== "SUPER_ADMIN") return apiForbidden("Only super admins can delete crops");
    const { id } = await params;

    await prisma.crop.update({ where: { id }, data: { isActive: false } });
    return apiSuccess(null, "Crop deactivated");
}
