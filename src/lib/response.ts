// =============================================================================
// API RESPONSE UTILITIES
// =============================================================================
import { NextResponse } from "next/server";

export type ApiMeta = {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
};

/** 200 Success */
export function apiSuccess<T>(
    data: T,
    message = "Success",
    meta?: ApiMeta,
    status = 200
) {
    return NextResponse.json({ success: true, message, data, ...(meta && { meta }) }, { status });
}

/** 201 Created */
export function apiCreated<T>(data: T, message = "Created successfully") {
    return NextResponse.json({ success: true, message, data }, { status: 201 });
}

/** 400 Bad Request */
export function apiBadRequest(message = "Bad request", errors?: unknown) {
    return NextResponse.json(
        { success: false, message, ...(errors && { errors }) },
        { status: 400 }
    );
}

/** 401 Unauthorized */
export function apiUnauthorized(message = "Unauthorized") {
    return NextResponse.json({ success: false, message }, { status: 401 });
}

/** 403 Forbidden */
export function apiForbidden(message = "Forbidden") {
    return NextResponse.json({ success: false, message }, { status: 403 });
}

/** 404 Not Found */
export function apiNotFound(message = "Resource not found") {
    return NextResponse.json({ success: false, message }, { status: 404 });
}

/** 409 Conflict */
export function apiConflict(message = "Conflict") {
    return NextResponse.json({ success: false, message }, { status: 409 });
}

/** 422 Unprocessable Entity */
export function apiValidationError(errors: unknown, message = "Validation failed") {
    return NextResponse.json({ success: false, message, errors }, { status: 422 });
}

/** 429 Rate Limited */
export function apiRateLimited(message = "Too many requests. Please slow down.") {
    return NextResponse.json({ success: false, message }, { status: 429 });
}

/** 500 Internal Server Error */
export function apiServerError(error?: unknown, message = "Internal server error") {
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
        {
            success: false,
            message,
            ...(isDev && error && { debug: String(error) }),
        },
        { status: 500 }
    );
}

// =============================================================================
// PAGINATION HELPER
// =============================================================================
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export function getPagination(
    searchParams: URLSearchParams,
    defaultLimit = 10,
    maxLimit = 100
): PaginationParams {
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
        maxLimit,
        Math.max(1, parseInt(searchParams.get("limit") || String(defaultLimit)))
    );
    return { page, limit, skip: (page - 1) * limit };
}

export function buildMeta(total: number, page: number, limit: number): ApiMeta {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

// =============================================================================
// SORTING & FILTERING HELPERS
// =============================================================================
export function getSortOrder(
    searchParams: URLSearchParams,
    allowedFields: string[],
    defaultField = "createdAt"
): { [key: string]: "asc" | "desc" } {
    const sortBy = searchParams.get("sortBy") || defaultField;
    const sortDir = searchParams.get("sortDir") || "desc";
    const field = allowedFields.includes(sortBy) ? sortBy : defaultField;
    return { [field]: sortDir === "asc" ? "asc" : "desc" };
}

/** Build a Prisma-compatible where filter for soft-deleted records */
export function notDeleted() {
    return { deletedAt: null };
}

/** Soft-delete update payload */
export function softDeletePayload() {
    return { deletedAt: new Date() };
}
