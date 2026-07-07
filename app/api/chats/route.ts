import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiSuccess,
  apiCreated,
  apiBadRequest,
  apiServerError,
  apiValidationError,
  getPagination,
  buildMeta
} from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { StartChatSchema } from "@/validators/schemas";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);

    const where = {
      OR: [
        { user1Id: auth.user.sub },
        { user2Id: auth.user.sub }
      ],
    };

    const [chats, total] = await Promise.all([
      prisma.chat.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastMessageAt: "desc" },

        include: {
          // ✅ FIXED HERE
          user1: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },

          // ✅ FIXED HERE
          user2: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },

          messages: {
            orderBy: { createdAt: "desc" },
            take: 1
          },

          _count: {
            select: { messages: true }
          }
        }
      }),

      prisma.chat.count({ where }),
    ]);

    return apiSuccess(
      chats,
      "Chats retrieved",
      buildMeta(total, page, limit)
    );

  } catch (err) {

    console.error("GET CHATS ERROR:", err);

    return apiServerError(err);
  }
}

export async function POST(req: NextRequest) {

  const auth = await getAuthUser(req);
  if ("error" in auth) return auth.error;

  try {

    const body = await req.json();

    const parsed = StartChatSchema.safeParse(body);

    if (!parsed.success)
      return apiValidationError(
        parsed.error.flatten().fieldErrors
      );

    if (parsed.data.participantId === auth.user.sub)
      return apiBadRequest(
        "Cannot start a chat with yourself"
      );

    // ✅ FIXED HERE
    const existing = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            user1Id: auth.user.sub,
            user2Id: parsed.data.participantId
          },
          {
            user1Id: parsed.data.participantId,
            user2Id: auth.user.sub
          },
        ],
      },
    });

    if (existing)
      return apiSuccess(
        existing,
        "Existing chat retrieved"
      );

    // ✅ FIXED HERE
    const chat = await prisma.chat.create({
      data: {
        user1Id: auth.user.sub,
        user2Id: parsed.data.participantId
      },
    });

    return apiCreated(chat, "Chat started");

  } catch (err) {

    console.error("POST CHAT ERROR:", err);

    return apiServerError(err);
  }
}