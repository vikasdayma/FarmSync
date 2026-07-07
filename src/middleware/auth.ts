// =============================================================================
// AUTHENTICATION MIDDLEWARE
// Verifies JWT access token from Authorization header
// =============================================================================
import { NextRequest } from "next/server";
import { verifyAccessToken, JwtPayload } from "@/lib/jwt";
import { apiUnauthorized, apiForbidden, apiRateLimited } from "@/lib/response";
import { checkRateLimit } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { Prisma, AuditAction } from "@/generated/prisma/client";

export type AuthenticatedRequest = NextRequest & {
    user?: JwtPayload;
};

/** Extract and verify the Bearer token from the request */
export async function getAuthUser(
  req: NextRequest
): Promise<{ user: JwtPayload } | { error: ReturnType<typeof apiUnauthorized> }> {
  
  // ✅ Read from cookie instead of Authorization header
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return { error: apiUnauthorized("Sign In To Continue  ") };
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { status: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      return { error: apiUnauthorized("Account not found") };
    }

    if (user.status === "LOCKED") {
      return { error: apiForbidden("Account is locked") };
    }
    if (user.status === "SUSPENDED") {
      return { error: apiForbidden("Account is suspended") };
    }

    return { user: payload };

  } catch {
    return { error: apiUnauthorized("Invalid or expired access token") };
  }
}

/** Middleware that checks allowed roles */
export function withRoles(allowedRoles: Role[]) {
    return async (
        req: NextRequest,
        handler: (req: NextRequest, user: JwtPayload) => Promise<Response>
    ): Promise<Response> => {
        const result = await getAuthUser(req);
        if ("error" in result) return result.error;

        if (allowedRoles.length > 0 && !allowedRoles.includes(result.user.role as Role)) {
            return apiForbidden(
                `Access denied. Required roles: ${allowedRoles.join(", ")}`
            );
        }

        return handler(req, result.user);
    };
}

/** Main auth guard — wraps a route handler */
export async function withAuth<T extends unknown[]>(
    req: NextRequest,
    handler: (req: NextRequest, user: JwtPayload, ...args: T) => Promise<Response>,
    allowedRoles: Role[] = [],
    ...args: T
): Promise<Response> {
    const result = await getAuthUser(req);
    if ("error" in result) return result.error;

    if (allowedRoles.length > 0 && !allowedRoles.includes(result.user.role as Role)) {
        return apiForbidden(
            `Access denied. Required roles: ${allowedRoles.join(", ")}`
        );
    }

    return handler(req, result.user, ...args);
}

// =============================================================================
// RATE LIMITING MIDDLEWARE
// Uses Redis sliding window — per-IP and per-user
// =============================================================================
export async function withRateLimit(
    req: NextRequest,
    userId?: string,
    maxRequests = 100,
    windowMs = 60_000
): Promise<{ limited: boolean; response?: Response }> {
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";
    const key = userId ? `rl:user:${userId}` : `rl:ip:${ip}`;

    const { allowed, remaining, resetAt } = await checkRateLimit(
        key,
        maxRequests,
        windowMs
    );

    if (!allowed) {
        return {
            limited: true,
            response: apiRateLimited(
                `Rate limit exceeded. Resets at ${new Date(resetAt).toISOString()}`
            ),
        };
    }

    return { limited: false };
}

// =============================================================================
// AUDIT LOGGER
// =============================================================================

export async function createAuditLog(params: {
    actorId: string;
    action: AuditAction;
    entity: string;
    entityId: string;
    oldValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
    req?: NextRequest;
    metadata?: Record<string, unknown>;
}): Promise<void> {
    try {
        const ip =
            params.req?.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
            params.req?.headers.get("x-real-ip") ||
            undefined;
        await prisma.auditLog.create({
            data: {
                actorId: params.actorId,
                action: params.action,
                entity: params.entity,
                entityId: params.entityId,
                oldValue: (params.oldValue ?? undefined) as Prisma.InputJsonValue | undefined,
                newValue: (params.newValue ?? undefined) as Prisma.InputJsonValue | undefined,
                ipAddress: ip,
                userAgent: params.req?.headers.get("user-agent") ?? undefined,
                metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
            },
        });
    } catch (err) {
        // Audit log failure should never crash the main request
        console.error("[AuditLog] Failed to create audit log:", err);
    }
}

/** Create an activity log entry */
export async function createActivityLog(params: {
    userId: string;
    action: string;
    description: string;
    req?: NextRequest;
    metadata?: Record<string, unknown>;
}): Promise<void> {
    try {
        const ip =
            params.req?.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
            undefined;

        await prisma.activityLog.create({
            data: {
                userId: params.userId,
                action: params.action,
                description: params.description,
                ipAddress: ip,
                userAgent: params.req?.headers.get("user-agent") ?? undefined,
            metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
            },
        });
    } catch (err) {
        console.error("[ActivityLog] Failed:", err);
    }
}

// =============================================================================
// NOTIFICATION HELPER
// =============================================================================
export async function createNotification(params: {
    userId: string;
    type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "SYSTEM" | "MARKETING";
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
}): Promise<void> {
    try {
        await prisma.notification.create({
            data: {
                ...params,
                metadata: params.metadata as Prisma.InputJsonValue | undefined,
            },
        });
    } catch (err) {
        console.error("[Notification] Failed:", err);
    }
}
