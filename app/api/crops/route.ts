

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { CreateCropSchema } from "@/validators/schemas";
import { getPagination, buildMeta, getSortOrder } from "@/lib/response";
import { cacheGet, cacheSet } from "@/lib/redis";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const season = searchParams.get("season");

    const cacheKey = `crops:p${page}:l${limit}:s:${search}:cat:${category}:sea:${season}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return apiSuccess((cached as Record<string, unknown>).data, "Crops (cached)", (cached as Record<string, unknown>).meta as Record<string, unknown>);

    const where = {
        isActive: true,
        ...(category && { category }),
        ...(season && { season }),
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { scientificName: { contains: search, mode: "insensitive" as const } },
                { category: { contains: search, mode: "insensitive" as const } },
            ]
        }),
    };

    const [crops, total] = await Promise.all([
        prisma.crop.findMany({
            where, skip, take: limit,
            orderBy: getSortOrder(searchParams, ["name", "category", "season"]),
        }),
        prisma.crop.count({ where }),
    ]);

    const meta = buildMeta(total, page, limit);
    await cacheSet(cacheKey, { data: crops, meta }, 600); 
    return apiSuccess(crops, "Crops retrieved", meta);
}

// export async function POST(req: NextRequest) {
//     const auth = await getAuthUser(req);
//     if ("error" in auth) return auth.error;
//     if (!["SUPER_ADMIN", "AGRONOMIST"].includes(auth.user.role)) {
//         return apiForbidden("Only admins and agronomists can add crops");
//     }

//     try {
//         const body = await req.json();
//         const parsed = CreateCropSchema.safeParse(body);
//         if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

//         const crop = await prisma.crop.create({ data: parsed.data });
//         return apiCreated(crop, "Crop created successfully");
//     } catch (err) {
//         return apiServerError(err);
//     }
// }
import { cacheDelete } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if ("error" in auth) return auth.error;

  if (!["SUPER_ADMIN", "AGRONOMIST"].includes(auth.user.role)) {
    return apiForbidden("Only admins and agronomists can add crops");
  }

  try {
    const body = await req.json();
    const parsed = CreateCropSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten().fieldErrors);
    }

    const crop = await prisma.crop.create({
      data: parsed.data,
    });

    // Clear all cached crop lists
    await cacheDelete("crops:*");

    return apiCreated(crop, "Crop created successfully");
  } catch (err) {
    return apiServerError(err);
  }
}