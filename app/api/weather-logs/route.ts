

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiCreated, apiForbidden, apiNotFound, apiServerError, apiValidationError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { CreateWeatherLogSchema } from "@/validators/schemas";
import { getPagination, buildMeta, getSortOrder } from "@/lib/response";
import { cacheGet, cacheSet } from "@/lib/redis";
import { Prisma } from "@/generated/prisma/client";
export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const farmId = searchParams.get("farmId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const cacheKey = `weather:farm:${farmId}:p${page}:f${from}:t${to}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return apiSuccess((cached as Record<string, unknown>).data, "Weather logs (cached)", (cached as Record<string, unknown>).meta as Record<string, unknown>);

    const where = {
        ...(farmId && { farmId }),
        ...(from && { recordedAt: { gte: new Date(from) } }),
        ...(to && { recordedAt: { lte: new Date(to) } }),
    };

    const [logs, total] = await Promise.all([
        prisma.weatherLog.findMany({
            where, skip, take: limit,
            orderBy: getSortOrder(searchParams, ["recordedAt", "temperatureC", "rainfallMm"]),
        }),
        prisma.weatherLog.count({ where }),
    ]);

    const meta = buildMeta(total, page, limit);
    await cacheSet(cacheKey, { data: logs, meta }, 300);
    return apiSuccess(logs, "Weather logs retrieved", meta);
}

export async function POST(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["FARMER", "AGRONOMIST", "SUPER_ADMIN"].includes(auth.user.role)) {
        return apiForbidden("Insufficient permissions to log weather data");
    }

    try {
        const body = await req.json();
        const parsed = CreateWeatherLogSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

       
const log = await prisma.weatherLog.create({
    data: {
        ...parsed.data,
        recordedAt: new Date(parsed.data.recordedAt),
        forecastData: parsed.data.forecastData as Prisma.InputJsonValue | undefined,
    },
});
        return apiCreated(log, "Weather log created");
    } catch (err) {
        return apiServerError(err);
    }
}
