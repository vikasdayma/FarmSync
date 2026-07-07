import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/middleware/auth";
import { apiSuccess, apiServerError } from "@/lib/response";
import { roleChatMap } from "@/lib/constant/chat";

export async function GET(req: NextRequest) {
  try {
    const authResult = await getAuthUser(req); // ✅ fix 3: pass req
    if ("error" in authResult) {
      return authResult.error;
    }

    const currentUser = authResult.user;

    const allowedRoles = roleChatMap[currentUser.role] || [];
    if (allowedRoles.length === 0) {
      return apiSuccess([]);
    }

    const users = await prisma.user.findMany({
      where: {
        role: { in: allowedRoles },
        id: { not: currentUser.sub }, // ✅ fix 2: sub not id
      },
      select: {
        id: true,
        firstName: true, // ✅ fix 1: firstName not name
        lastName: true,
        role: true,
        avatarUrl: true, // ✅ avatarUrl not profileImage
      },
      orderBy: { firstName: "asc" }, // ✅ firstName not name
    });

    return apiSuccess(users);
  } catch (error) {
    console.error("GET_CHAT_USERS_ERROR:", error);
    return apiServerError("Failed to fetch chat users");
  }
}