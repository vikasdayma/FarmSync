

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiNotFound, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { cacheGet, cacheSet } from "@/lib/redis";
import { notDeleted } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    const { id } = await params;

    const cacheKey = `farm:${id}:stats`;
    const cached = await cacheGet(cacheKey);
    if (cached) return apiSuccess(cached, "Farm stats (cached)");

    const farm = await prisma.farm.findFirst({
        where: { id, ...notDeleted() },
        select: { id: true, ownerId: true, name: true },
    });

    if (!farm) return apiNotFound("Farm not found");
    if (farm.ownerId !== auth.user.sub && !["SUPER_ADMIN", "GOVERNMENT_OFFICER", "AGRONOMIST"].includes(auth.user.role)) {
        return apiForbidden("Access denied to farm statistics");
    }

    const [
        cropCyclesTotal,
        cropCyclesActive,
        cropCyclesCompleted,
        soilReportsTotal,
        diseaseReportsActive,
        equipmentCount,
        weatherLogs30d,
        totalHarvestedKg,
        avgYieldKg,
    ] = await Promise.all([
        prisma.cropCycle.count({ where: { farmId: id, ...notDeleted() } }),
        prisma.cropCycle.count({ where: { farmId: id, status: "ACTIVE" } }),
        prisma.cropCycle.count({ where: { farmId: id, status: "COMPLETED" } }),
        prisma.soilReport.count({ where: { farmId: id, ...notDeleted() } }),
        prisma.diseaseReport.count({ where: { farmId: id, status: { in: ["REPORTED", "UNDER_REVIEW", "CONFIRMED"] } } }),
        prisma.equipment.count({ where: { farmId: id, ...notDeleted() } }),
        prisma.weatherLog.count({
            where: {
                farmId: id,
                recordedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
        }),
        prisma.cropCycle.aggregate({
            where: { farmId: id, status: "COMPLETED" },
            _sum: { actualYieldKg: true },
        }),
        prisma.cropCycle.aggregate({
            where: { farmId: id, status: "COMPLETED", actualYieldKg: { not: null } },
            _avg: { actualYieldKg: true },
        }),
    ]);

    const stats = {
        farmId: id,
        farmName: farm.name,
        cropCycles: {
            total: cropCyclesTotal,
            active: cropCyclesActive,
            completed: cropCyclesCompleted,
            failed: cropCyclesTotal - cropCyclesActive - cropCyclesCompleted,
        },
        soilReports: soilReportsTotal,
        activeDiseaseAlerts: diseaseReportsActive,
        equipment: equipmentCount,
        weatherLogs30d,
        yield: {
            totalHarvestedKg: totalHarvestedKg._sum.actualYieldKg ?? 0,
            averageYieldPerCycle: avgYieldKg._avg.actualYieldKg ?? 0,
        },
        generatedAt: new Date().toISOString(),
    };

    await cacheSet(cacheKey, stats, 600); 
    return apiSuccess(stats, "Farm statistics retrieved");
}
