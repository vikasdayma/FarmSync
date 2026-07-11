// =============================================================================
// REDIS CLIENT - Caching & Rate Limiting
// =============================================================================
import Redis from "ioredis";

declare global {
    var __redis: Redis | undefined;
}

const createRedisClient = () => {
    const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        enableReadyCheck: false,
    });

    client.on("error", (err) => {
        console.error("[Redis] Connection error:", err.message);
    });

    client.on("connect", () => {
        console.log("[Redis] Connected successfully");
    });

    return client;
};

export const redis = global.__redis || createRedisClient();

if (process.env.NODE_ENV !== "production") {
    global.__redis = redis;
}

// =============================================================================
// REDIS HELPER METHODS
// =============================================================================

/** Get cached JSON value */
export async function cacheGet<T>(key: string): Promise<T | null> {
    try {
        const data = await redis.get(key);
        return data ? (JSON.parse(data) as T) : null;
    } catch {
        return null;
    }
}

/** Set JSON value with optional TTL in seconds */
export async function cacheSet(
    key: string,
    value: unknown,
    ttlSeconds = 300
): Promise<void> {
    try {
        await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
        console.error("[Redis] cacheSet failed:", err);
    }
}

/** Delete a cache key */
export async function cacheDel(key: string): Promise<void> {
    try {
        await redis.del(key);
    } catch (err) {
        console.error("[Redis] cacheDel failed:", err);
    }
}

/** Delete all keys matching a pattern */
export async function cacheDelPattern(pattern: string): Promise<void> {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (err) {
        console.error("[Redis] cacheDelPattern failed:", err);
    }
}

/** Rate limiter: returns { allowed, remaining, resetAt } */
export async function checkRateLimit(
    key: string,
    maxRequests: number,
    windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const windowSec = Math.floor(windowMs / 1000);
    const now = Date.now();
    const resetAt = now + windowMs;

    try {
        const multi = redis.multi();
        multi.incr(key);
        multi.expire(key, windowSec);
        const results = await multi.exec();
        const count = (results?.[0]?.[1] as number) || 0;

        return {
            allowed: count <= maxRequests,
            remaining: Math.max(0, maxRequests - count),
            resetAt,
        };
    } catch {
        // Fail open — allow the request if Redis is down
        return { allowed: true, remaining: maxRequests, resetAt };
    }
}

export async function cacheDelete(pattern: string) {
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(...keys);
  }
}