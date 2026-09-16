import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp-relay.brevo.com";
const port = parseInt(process.env.SMTP_PORT || "587", 10);
const user = process.env.SMTP_USER || "";
const pass = process.env.SMTP_PASS || "";
const fromEmail = process.env.SENDER_EMAIL || "jigmatdorjey255@gmail.com";

export const emailTransporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const info = await emailTransporter.sendMail({
      from: `"Yarkha Organic Farm" <${fromEmail}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ""),
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Email send failure:", error);
    return { success: false, error: error.message };
  }
}
