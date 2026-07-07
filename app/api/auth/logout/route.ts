import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiServerError } from "@/lib/response";
import { getAuthUser, createAuditLog } from "@/middleware/auth";

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if ("error" in auth) return auth.error;

  try {
    // ✅ Step 1 — revoke session in DB (your existing code, correct)
    await prisma.session.updateMany({
      where: { id: auth.user.sessionId, userId: auth.user.sub },
      data: { isRevoked: true, revokedAt: new Date() },
    });

    // ✅ Step 2 — audit log (your existing code, correct)
    await createAuditLog({
      actorId: auth.user.sub, action: "LOGOUT", entity: "Session",
      entityId: auth.user.sessionId, req,
    });

    // ✅ Step 3 — DELETE cookies from browser (this was missing!)
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    console.log("🚪 User logged out — cookies deleted, session revoked");

    return response;

  } catch (err) {
    return apiServerError(err);
  }
}