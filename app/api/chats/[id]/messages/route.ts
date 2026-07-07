import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
    apiSuccess, 
    apiCreated, 
    apiNotFound, 
    apiServerError, 
    apiValidationError 
} from "@/lib/response";
import { getAuthUser } from "@/middleware/auth";
import { SendMessageSchema } from "@/validators/schemas";
import { getPagination, buildMeta } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

// ✅ FIXED - was using participantAId/participantBId
async function getChat(id: string, userId: string) {
    return prisma.chat.findFirst({
        where: { 
            id, 
            OR: [{ user1Id: userId }, { user2Id: userId }] 
        },
    });
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthUser(req);
        if ("error" in auth) return auth.error;

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const { page, limit, skip } = getPagination(searchParams);

        const chat = await getChat(id, auth.user.sub);
        if (!chat) return apiNotFound("Chat not found");

        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where: { chatId: id },
                skip,
                take: limit,
                orderBy: { createdAt: "asc" },
                include: { 
                    sender: { 
                        select: { 
                            id: true, 
                            firstName: true, 
                            lastName: true, 
                            avatarUrl: true,
                            role: true  // ✅ ADDED - useful for role badges in UI
                        } 
                    } 
                },
            }),
            prisma.message.count({ where: { chatId: id } }),
        ]);

        // ✅ Mark messages as read
        await prisma.message.updateMany({
            where: { 
                chatId: id, 
                senderId: { not: auth.user.sub }, 
                isRead: false 
            },
            data: { isRead: true, readAt: new Date() },
        });

        return apiSuccess(messages, "Messages retrieved", buildMeta(total, page, limit));

    } catch (err) {
        console.error("GET MESSAGES ERROR:", err);
        return apiServerError(err);
    }
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthUser(req);
        if ("error" in auth) return auth.error;

        const { id } = await params;

        const chat = await getChat(id, auth.user.sub);
        if (!chat) return apiNotFound("Chat not found or unauthorized");

        const body = await req.json();
        const parsed = SendMessageSchema.safeParse(body);
        if (!parsed.success) return apiValidationError(parsed.error.flatten().fieldErrors);

        const [message] = await prisma.$transaction([
            prisma.message.create({
                data: { 
                    chatId: id, 
                    senderId: auth.user.sub, 
                    content: parsed.data.content, 
                    // attachmentUrls: parsed.data.attachmentUrls ?? [] 
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                            role: true  // ✅ ADDED - return sender info immediately
                        }
                    }
                }
            }),
            prisma.chat.update({ 
                where: { id }, 
                data: { lastMessageAt: new Date() } 
            }),
        ]);

        return apiCreated(message, "Message sent");

    } catch (err) {
        console.error("POST MESSAGE ERROR:", err);
        return apiServerError(err);
    }
}