import nodemailer from "nodemailer";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMoney(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

function buildItemsHtml(items: any[]): string {
  if (!Array.isArray(items) || items.length === 0) return "<p><i>No items</i></p>";

  const rows = items
    .map((item: any) => {
      const title = escapeHtml(item?.title || item?.slug || "Item");
      const qty = Number(item?.quantity || 1);
      const price = formatMoney(item?.price ?? item?.basePrice ?? 0);

      const options = Array.isArray(item?.options) ? item.options : [];
      const optionsHtml = options.length
        ? `<ul>${options
            .map((opt: any) => {
              const optName = escapeHtml(opt?.name || "Option");
              const optPrice = formatMoney(opt?.price ?? 0);
              return `<li>${optName} (+$${optPrice})</li>`;
            })
            .join("")}</ul>`
        : "";

      return `<li><b>${title}</b> — $${price}${Number.isFinite(qty) && qty !== 1 ? ` (qty ${qty})` : ""}${optionsHtml}</li>`;
    })
    .join("");

  return `<ul>${rows}</ul>`;
}

export async function sendCompanyOrderNotificationEmail(params: {
  order: any;
  source: string;
  kind?: "one-time" | "subscription";
}) {
  const { order, source, kind } = params;

  const to =
    String(process.env.ORDER_NOTIFICATION_EMAIL || process.env.EMAIL_TO || "").trim() ||
    null;
  if (!to) {
    return { ok: false as const, skipped: true as const, reason: "Missing ORDER_NOTIFICATION_EMAIL/EMAIL_TO" };
  }

  const fromEmailRaw = String(
    process.env.FROM_EMAIL ||
      (process.env.EMAIL_USER ? `CallTechCare <${process.env.EMAIL_USER}>` : "") ||
      "CallTechCare <support@calltechcare.com>"
  ).trim();

  const orderId = escapeHtml(order?._id || "(no id)");
  const customerName = escapeHtml(order?.contact?.name || "Customer");
  const customerEmail = escapeHtml(order?.email || order?.contact?.email || "unknown");
  const customerPhone = escapeHtml(order?.contact?.phone || "");
  const total = formatMoney(order?.total ?? 0);
  const createdAt = order?.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();
  const stripeRef = escapeHtml(order?.stripeSessionId || order?.stripeSubscriptionId || "");

  const subject = `New order received${kind ? ` (${kind})` : ""} — $${total} — ${customerName}`;
  const baseUrl = String(process.env.NEXT_PUBLIC_BASE_URL || "").trim();

  const address = order?.address || {};
  const schedule = order?.schedule || {};

  const html = `
    <h2>New Order Received</h2>
    <p><b>Order ID:</b> ${orderId}</p>
    <p><b>Placed:</b> ${escapeHtml(createdAt)}</p>
    <p><b>Total:</b> $${escapeHtml(total)}</p>
    ${stripeRef ? `<p><b>Stripe Ref:</b> ${stripeRef}</p>` : ""}
    <hr />
    <h3>Customer</h3>
    <p><b>Name:</b> ${customerName}</p>
    <p><b>Email:</b> ${customerEmail}</p>
    ${customerPhone ? `<p><b>Phone:</b> ${customerPhone}</p>` : ""}
    <hr />
    <h3>Items</h3>
    ${buildItemsHtml(order?.items || [])}
    <hr />
    <h3>Address</h3>
    <p>
      ${escapeHtml(address?.street || "")}${address?.street ? "<br />" : ""}
      ${escapeHtml(address?.city || "")}${address?.city ? ", " : ""}${escapeHtml(address?.state || "")} ${escapeHtml(address?.zip || "")}
    </p>
    <h3>Schedule</h3>
    <p>${escapeHtml(schedule?.date || "")} ${escapeHtml(schedule?.time || "")}</p>
    ${baseUrl ? `<hr /><p><a href="${escapeHtml(baseUrl)}/account" target="_blank" rel="noreferrer">Open site account page</a></p>` : ""}
    <hr />
    <details>
      <summary>Raw order JSON</summary>
      <pre style="white-space:pre-wrap">${escapeHtml(JSON.stringify(order, null, 2))}</pre>
    </details>
    <p style="color:#64748b; font-size:12px;">Source: ${escapeHtml(source)}</p>
  `;

  // Prefer Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: fromEmailRaw,
        to: [to],
        ...(process.env.BCC_EMAIL ? { bcc: [String(process.env.BCC_EMAIL)] } : {}),
        subject,
        html,
      });
      return { ok: true as const, skipped: false as const, provider: "resend" as const };
    } catch (err) {
      logger.error("Company order notification failed (Resend)", err, { to, source });
      // fall through to nodemailer
    }
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return {
      ok: false as const,
      skipped: true as const,
      reason: "Missing EMAIL_USER/EMAIL_PASS (and RESEND_API_KEY not usable)",
    };
  }

  await transporter.sendMail({
    from: fromEmailRaw,
    to,
    ...(process.env.BCC_EMAIL ? { bcc: String(process.env.BCC_EMAIL) } : {}),
    subject,
    html,
  });

  return { ok: true as const, skipped: false as const, provider: "nodemailer" as const };
}

export async function sendResetEmail(to: string, resetUrl: string) {
  const mailOptions = {
    from: `"CallTechCare Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
