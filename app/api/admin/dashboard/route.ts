

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiForbidden, apiServerError } from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { cacheGet, cacheSet } from "@/lib/redis";

export async function GET(req: NextRequest) {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;
    if (!["SUPER_ADMIN", "GOVERNMENT_OFFICER"].includes(auth.user.role)) {
        return apiForbidden("Only admins and government officers can access dashboard stats");
    }

    const cacheKey = "admin:dashboard";
    const cached = await cacheGet(cacheKey);
    if (cached) return apiSuccess(cached, "Dashboard analytics (cached)");

    try {
        const [
            totalUsers, activeUsers, newUsersThisMonth,
            totalFarms, activeFarms,
            totalCropCycles, activeCropCycles,
            totalOrders, pendingOrders, ordersThisMonth,
            totalLoans, pendingLoans, approvedLoans,
            totalSubsidies, pendingSubsidies,
            totalListings, activeListings,
            totalRevenue,
            diseaseReportsBySeverity,
            usersByRole,
        ] = await Promise.all([
            prisma.user.count({ where: { deletedAt: null } }),
            prisma.user.count({ where: { status: "ACTIVE", deletedAt: null } }),
            prisma.user.count({
                where: { createdAt: { gte: new Date(new Date().setDate(1)) }, deletedAt: null },
            }),
            prisma.farm.count({ where: { deletedAt: null } }),
            prisma.farm.count({ where: { status: "ACTIVE", deletedAt: null } }),
            prisma.cropCycle.count({ where: { deletedAt: null } }),
            prisma.cropCycle.count({ where: { status: "ACTIVE", deletedAt: null } }),
            prisma.order.count(),
            prisma.order.count({ where: { status: "PENDING" } }),
            prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setDate(1)) } } }),
            prisma.loan.count({ where: { deletedAt: null } }),
            prisma.loan.count({ where: { status: "SUBMITTED" } }),
            prisma.loan.count({ where: { status: "APPROVED" } }),
            prisma.subsidy.count({ where: { deletedAt: null } }),
            prisma.subsidy.count({ where: { status: "SUBMITTED" } }),
            prisma.marketplaceListing.count({ where: { deletedAt: null } }),
            prisma.marketplaceListing.count({ where: { status: "ACTIVE", deletedAt: null } }),
            prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: "DELIVERED" } }),
            prisma.diseaseReport.groupBy({ by: ["severity"], _count: { severity: true } }),
            prisma.user.groupBy({ by: ["role"], _count: { role: true } }),
        ]);

        const stats = {
            users: { total: totalUsers, active: activeUsers, newThisMonth: newUsersThisMonth, byRole: Object.fromEntries(usersByRole.map((r) => [r.role, r._count.role])) },
            farms: { total: totalFarms, active: activeFarms },
            cropCycles: { total: totalCropCycles, active: activeCropCycles },
            orders: { total: totalOrders, pending: pendingOrders, thisMonth: ordersThisMonth },
            revenue: { totalDelivered: totalRevenue._sum.totalAmount ?? 0 },
            loans: { total: totalLoans, pending: pendingLoans, approved: approvedLoans },
            subsidies: { total: totalSubsidies, pending: pendingSubsidies },
            marketplace: { total: totalListings, active: activeListings },
            diseaseAlerts: Object.fromEntries(diseaseReportsBySeverity.map((d) => [`severity_${d.severity}`, d._count.severity])),
            generatedAt: new Date().toISOString(),
        };

        await cacheSet(cacheKey, stats, 900); 
        return apiSuccess(stats, "Dashboard analytics retrieved");
    } catch (err) {
        return apiServerError(err);
    }
}
