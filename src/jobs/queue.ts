
import { sendEmail, getVerificationEmailHtml, getPasswordResetEmailHtml, getLoanStatusEmailHtml, getNotificationEmailHtml } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export type JobType =
    | "SEND_VERIFICATION_EMAIL"
    | "SEND_RESET_PASSWORD_EMAIL"
    | "SEND_LOAN_STATUS_EMAIL"
    | "SEND_NOTIFICATION_EMAIL"
    | "GENERATE_SOIL_REPORT_PDF"
    | "SYNC_WEATHER_DATA"
    | "CLEANUP_EXPIRED_TOKENS"
    | "BROADCAST_NOTIFICATION"
    | "AGGREGATE_ANALYTICS";

export interface Job {
    id: string;
    type: JobType;
    payload: Record<string, unknown>;
    attempts: number;
    createdAt: string;
}

export async function enqueueJob(type: JobType, payload: Record<string, unknown>): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const job: Job = {
        id: jobId,
        type,
        payload,
        attempts: 0,
        createdAt: new Date().toISOString(),
    };
    await redis.lpush("agrisaas:jobs", JSON.stringify(job));
    console.log(`[JobQueue] Enqueued job ${jobId} of type ${type}`);
    return jobId;
}

export async function processJob(job: Job): Promise<void> {
    console.log(`[JobWorker] Processing job ${job.id} (${job.type})`);

    switch (job.type) {
        case "SEND_VERIFICATION_EMAIL": {
            const { to, firstName, verifyUrl } = job.payload as {
                to: string; firstName: string; verifyUrl: string;
            };
            await sendEmail({
                to,
                subject: "Verify your AgriSaaS account",
                html: getVerificationEmailHtml(verifyUrl, firstName),
            });
            break;
        }

        case "SEND_RESET_PASSWORD_EMAIL": {
            const { to, firstName, resetUrl } = job.payload as {
                to: string; firstName: string; resetUrl: string;
            };
            await sendEmail({
                to,
                subject: "Reset your AgriSaaS password",
                html: getPasswordResetEmailHtml(resetUrl, firstName),
            });
            break;
        }

        case "SEND_LOAN_STATUS_EMAIL": {
            const { to, firstName, status, appNo, reviewNotes } = job.payload as {
                to: string; firstName: string; status: string; appNo: string; reviewNotes?: string;
            };
            await sendEmail({
                to,
                subject: `Loan Application ${status} - ${appNo}`,
                html: getLoanStatusEmailHtml(firstName, status, appNo, reviewNotes),
            });
            break;
        }

        case "SEND_NOTIFICATION_EMAIL": {
            const { to, title, body } = job.payload as {
                to: string; title: string; body: string;
            };
            await sendEmail({
                to,
                subject: title,
                html: getNotificationEmailHtml(title, body),
            });
            break;
        }

        case "CLEANUP_EXPIRED_TOKENS": {
            const now = new Date();
            const [prt, evt] = await Promise.all([
                prisma.passwordResetToken.deleteMany({
                    where: { expiresAt: { lt: now } },
                }),
                prisma.emailVerificationToken.deleteMany({
                    where: { expiresAt: { lt: now } },
                }),
            ]);
            console.log(`[Cleanup] Deleted ${prt.count} password tokens, ${evt.count} email tokens`);
            break;
        }

        case "BROADCAST_NOTIFICATION": {
            const { roles, title, body } = job.payload as {
                roles?: string[]; title: string; body: string;
            };
            const users = await prisma.user.findMany({
                where: {
                    deletedAt: null,
                    status: "ACTIVE",
                    ...(roles && { role: { in: roles as never[] } }),
                },
                select: { id: true },
            });
            await prisma.notification.createMany({
                data: users.map((u) => ({
                    userId: u.id,
                    type: "SYSTEM" as const,
                    title,
                    body,
                })),
            });
            console.log(`[Broadcast] Sent to ${users.length} users`);
            break;
        }

        case "SYNC_WEATHER_DATA": {
            // Simulate fetching weather data from external API
            console.log("[WeatherSync] Simulated weather data sync completed");
            break;
        }

        case "AGGREGATE_ANALYTICS": {
            const [totalUsers, totalFarms, totalOrders, totalRevenue] = await Promise.all([
                prisma.user.count({ where: { deletedAt: null } }),
                prisma.farm.count({ where: { deletedAt: null } }),
                prisma.order.count(),
                prisma.payment.aggregate({
                    where: { status: "COMPLETED" },
                    _sum: { amount: true },
                }),
            ]);
            const analytics = {
                totalUsers,
                totalFarms,
                totalOrders,
                totalRevenue: totalRevenue._sum.amount ?? 0,
                aggregatedAt: new Date().toISOString(),
            };
            await redis.setex("platform:analytics:snapshot", 3600, JSON.stringify(analytics));
            console.log("[Analytics] Snapshot saved:", analytics);
            break;
        }

        default:
            console.warn(`[JobWorker] Unknown job type: ${(job as Job).type}`);
    }
}

export async function startWorker(): Promise<void> {
    console.log("[JobWorker] Worker started");
    while (true) {
        try {
            const raw = await redis.brpop("agrisaas:jobs", 5); // 5s timeout
            if (raw) {
                const [, data] = raw;
                const job = JSON.parse(data) as Job;
                job.attempts += 1;
                try {
                    await processJob(job);
                } catch (err) {
                    console.error(`[JobWorker] Job ${job.id} failed (attempt ${job.attempts}):`, err);
                    if (job.attempts < 3) {
                        // Re-queue for retry
                        await redis.lpush("agrisaas:jobs", JSON.stringify(job));
                    } else {
                        await redis.lpush("agrisaas:jobs:dead", JSON.stringify({ ...job, error: String(err) }));
                    }
                }
            }
        } catch (err) {
            console.error("[JobWorker] Worker error:", err);
            await new Promise((r) => setTimeout(r, 1000));
        }
    }
}
