import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

/**
 * Send a 6-digit OTP verification email.
 */
export async function sendVerificationEmail(
    email: string,
    code: string
): Promise<void> {
    const { error } = await resend.emails.send({
        from: "Zync <noreply@yourdomain.com>", // ← replace with your verified Resend sender domain
        to: email,
        subject: `${code} is your Zync verification code`,
        html: `
            <div style="font-family:Inter,sans-serif;background:#0B0F19;color:#F1F5F9;padding:40px;max-width:480px;margin:0 auto;border-radius:16px;">
                <h1 style="font-size:28px;font-weight:900;margin:0 0 8px;background:linear-gradient(90deg,#06B6D4,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Zync</h1>
                <p style="color:#94A3B8;font-size:14px;margin:0 0 32px;">Verify your email to activate your account.</p>

                <p style="font-size:15px;margin:0 0 16px;color:#F1F5F9;">Your verification code:</p>
                <div style="background:#1E2A3A;border:1px solid rgba(6,182,212,0.3);border-radius:12px;padding:20px;text-align:center;letter-spacing:0.4em;font-size:36px;font-weight:900;color:#06B6D4;margin-bottom:24px;">
                    ${code}
                </div>

                <p style="font-size:13px;color:#64748B;margin:0;">This code expires in <strong style="color:#94A3B8;">3 minutes</strong>. If you didn't create a Zync account, you can safely ignore this email.</p>
            </div>
        `,
    });

    if (error) {
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
}
