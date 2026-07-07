

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET(_req: NextRequest) {
    const start = Date.now();
    const health: Record<string, unknown> = {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version ?? "1.0.0",
    };

    
    try {
        await prisma.$queryRaw`SELECT 1`;
        health.database = { status: "ok", latencyMs: Date.now() - start };
    } catch {
        health.database = { status: "error", message: "Database unreachable" };
        health.status = "degraded";
    }

    
    const redisStart = Date.now();
    try {
        await redis.ping();
        health.redis = { status: "ok", latencyMs: Date.now() - redisStart };
    } catch {
        health.redis = { status: "error", message: "Redis unreachable" };
        health.status = "degraded";
    }

    const statusCode = health.status === "ok" ? 200 : 503;
    return NextResponse.json({ success: health.status !== "error", data: health }, { status: statusCode });
}
