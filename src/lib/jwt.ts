// =============================================================================
// JWT TOKEN UTILITIES
// Access token (15m) + Refresh token (7d) strategy
// =============================================================================
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface JwtPayload {
    sub: string;       // userId
    email: string;
    role: Role;
    sessionId: string;
    iat?: number;
    exp?: number;
}

export interface RefreshTokenPayload {
    sub: string;       // userId
    sessionId: string;
    iat?: number;
    exp?: number;
}

/** Sign a short-lived access token */
export function signAccessToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: "agrisaas",
        audience: "agrisaas-client",
    } as jwt.SignOptions);
}

/** Sign a long-lived refresh token */
export function signRefreshToken(
    payload: Omit<RefreshTokenPayload, "iat" | "exp">
): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: "agrisaas",
        audience: "agrisaas-client",
    } as jwt.SignOptions);
}

/** Verify access token — throws if invalid/expired */
export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET, {
        issuer: "agrisaas",
        audience: "agrisaas-client",
    }) as JwtPayload;
}

/** Verify refresh token — throws if invalid/expired */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: "agrisaas",
        audience: "agrisaas-client",
    }) as RefreshTokenPayload;
}

/** Decode without verifying (for inspecting expired tokens) */
export function decodeToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
}
