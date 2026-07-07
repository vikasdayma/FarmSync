// =============================================================================
// NODEMAILER - Email Service
// =============================================================================
import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter;

function getTransporter(): Transporter {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
}

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
        filename: string;
        content: string | Buffer;
        contentType?: string;
    }>;
}

/** Send a transactional email */
export async function sendEmail(options: EmailOptions): Promise<void> {
    const transport = getTransporter();
    await transport.sendMail({
        from: process.env.SMTP_FROM || "AgriSaaS <noreply@agrisaas.com>",
        ...options,
    });
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

export function getVerificationEmailHtml(verifyUrl: string, firstName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:40px">
        <h2 style="color:#2d6a0f">Welcome to AgriSaaS, ${firstName}!</h2>
        <p>Thank you for registering. Please verify your email address to activate your account.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#2d6a0f;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">
          Verify Email Address
        </a>
        <p style="color:#666;font-size:12px">This link expires in 24 hours. If you didn't create this account, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetEmailHtml(resetUrl: string, firstName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:40px">
        <h2 style="color:#2d6a0f">Password Reset Request</h2>
        <p>Hi ${firstName}, we received a request to reset your password.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#d97706;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#666;font-size:12px">This link expires in 1 hour. If you didn't request a password reset, please ignore this email and secure your account.</p>
      </div>
    </body>
    </html>
  `;
}

export function getLoanStatusEmailHtml(
    firstName: string,
    status: string,
    appNo: string,
    reviewNotes?: string
): string {
    const color = status === "APPROVED" ? "#2d6a0f" : "#dc2626";
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:40px">
        <h2 style="color:${color}">Loan Application ${status}</h2>
        <p>Hi ${firstName}, your loan application <strong>#${appNo}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
        ${reviewNotes ? `<p><strong>Notes:</strong> ${reviewNotes}</p>` : ""}
        <p>Log in to your dashboard for more details.</p>
      </div>
    </body>
    </html>
  `;
}

export function getNotificationEmailHtml(title: string, body: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:40px">
        <h2 style="color:#2d6a0f">${title}</h2>
        <p>${body}</p>
      </div>
    </body>
    </html>
  `;
}
