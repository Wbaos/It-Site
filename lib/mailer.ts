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


export async function sendCompanyContactNotificationEmail(params: {
  contact: {
    name: string;
    email: string;
    company?: string;
    message: string;
  };
  source: string;
}) {
  const { contact, source } = params;

  const to = String(process.env.ORDER_NOTIFICATION_EMAIL || "").trim() || null;
  if (!to) {
    return {
      ok: false as const,
      skipped: true as const,
      reason: "Missing ORDER_NOTIFICATION_EMAIL",
    };
  }

  const fromEmailRaw = String(
    process.env.FROM_EMAIL ||
      (process.env.EMAIL_USER ? `CallTechCare <${process.env.EMAIL_USER}>` : "") ||
      "CallTechCare <support@calltechcare.com>"
  ).trim();

  const contactName = escapeHtml(contact?.name || "Contact");
  const contactEmail = String(contact?.email || "").trim();
  const contactCompany = escapeHtml(contact?.company || "");
  const contactMessage = escapeHtml(contact?.message || "").replace(/\n/g, "<br />");
  const receivedAt = new Date().toLocaleString();

  const subject = `New contact form submission — ${contactName}`;
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><b>Name:</b> ${contactName}</p>
    <p><b>Email:</b> ${escapeHtml(contactEmail)}</p>
    ${contactCompany ? `<p><b>Company:</b> ${contactCompany}</p>` : ""}
    <hr />
    <p><b>Message:</b><br />${contactMessage}</p>
    <hr />
    <p style="color:#64748b; font-size:12px;">Received: ${escapeHtml(receivedAt)}</p>
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
        ...(contactEmail ? { replyTo: contactEmail } : {}),
        subject,
        html,
      });
      return { ok: true as const, skipped: false as const, provider: "resend" as const };
    } catch (err) {
      logger.error("Company contact notification failed (Resend)", err, {
        to,
        source,
      });
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
    ...(contactEmail ? { replyTo: contactEmail } : {}),
    subject,
    html,
  });

  return { ok: true as const, skipped: false as const, provider: "nodemailer" as const };
}

export async function sendCompanyQuoteRequestNotificationEmail(params: {
  referenceNumber: string;
  quoteRequest: any;
  source: string;
}) {
  const { referenceNumber, quoteRequest, source } = params;

  const to = String(process.env.ORDER_NOTIFICATION_EMAIL || "").trim() || null;
  if (!to) {
    return {
      ok: false as const,
      skipped: true as const,
      reason: "Missing ORDER_NOTIFICATION_EMAIL",
    };
  }

  const fromEmailRaw = String(
    process.env.FROM_EMAIL ||
      (process.env.EMAIL_USER ? `CallTechCare <${process.env.EMAIL_USER}>` : "") ||
      "CallTechCare <support@calltechcare.com>"
  ).trim();

  const ref = escapeHtml(referenceNumber || "(no ref)");
  const contact = quoteRequest?.contact || {};
  const location = quoteRequest?.location || {};
  const service = quoteRequest?.service || {};
  const details = quoteRequest?.details || {};

  const contactName = escapeHtml(
    `${String(contact?.firstName || "").trim()} ${String(contact?.lastName || "").trim()}`.trim() ||
      "Customer"
  );
  const contactEmail = String(contact?.email || "").trim();
  const contactPhone = escapeHtml(contact?.phone || "");

  const subject = `New quote request — ${ref} — ${contactName}`;
  const html = `
    <h2>New Quote Request</h2>
    <p><b>Reference:</b> ${ref}</p>
    <hr />
    <h3>Contact</h3>
    <p><b>Name:</b> ${contactName}</p>
    <p><b>Email:</b> ${escapeHtml(contactEmail || "")}</p>
    ${contactPhone ? `<p><b>Phone:</b> ${contactPhone}</p>` : ""}
    <hr />
    <h3>Service</h3>
    <p><b>Category:</b> ${escapeHtml(service?.category || "")}</p>
    <p><b>Group:</b> ${escapeHtml(service?.group || "")}</p>
    <p><b>Service:</b> ${escapeHtml(service?.service || "")}</p>
    ${quoteRequest?.urgency ? `<p><b>Urgency:</b> ${escapeHtml(quoteRequest.urgency)}</p>` : ""}
    ${quoteRequest?.other ? `<p><b>Other:</b> ${escapeHtml(quoteRequest.other)}</p>` : ""}
    <hr />
    <h3>Location</h3>
    <p>
      ${escapeHtml(location?.streetAddress || "")}${location?.streetAddress ? "<br />" : ""}
      ${escapeHtml(location?.city || "")}${location?.city ? ", " : ""}${escapeHtml(location?.zipCode || "")}
    </p>
    <hr />
    <h3>Details</h3>
    ${details?.projectDetails ? `<p><b>Project details:</b><br />${escapeHtml(details.projectDetails).replace(/\n/g, "<br />")}</p>` : ""}
    <p><b>Technician visit first:</b> ${details?.wantsTechnicianVisitFirst ? "Yes" : "No"}</p>
    ${details?.preferredDate ? `<p><b>Preferred date:</b> ${escapeHtml(details.preferredDate)}</p>` : ""}
    ${details?.preferredTime ? `<p><b>Preferred time:</b> ${escapeHtml(details.preferredTime)}</p>` : ""}
    ${details?.heardAbout ? `<p><b>Heard about us:</b> ${escapeHtml(details.heardAbout)}</p>` : ""}
    <hr />
    <details>
      <summary>Raw quote request JSON</summary>
      <pre style="white-space:pre-wrap">${escapeHtml(JSON.stringify({ referenceNumber, ...quoteRequest }, null, 2))}</pre>
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
        ...(contactEmail ? { replyTo: contactEmail } : {}),
        subject,
        html,
      });
      return { ok: true as const, skipped: false as const, provider: "resend" as const };
    } catch (err) {
      logger.error("Company quote request notification failed (Resend)", err, {
        to,
        source,
        referenceNumber,
      });
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
    ...(contactEmail ? { replyTo: contactEmail } : {}),
    subject,
    html,
  });

  return { ok: true as const, skipped: false as const, provider: "nodemailer" as const };
}



export async function sendDiscountCodeEmail(params: {
  to: string;
  code: string;
  discountType: "percentage" | "flat";
  value: number;
  source: string;
}) {
  const to = String(params.to || "").trim();
  if (!to) {
    return { ok: false as const, skipped: true as const, reason: "Missing to" };
  }

  const code = String(params.code || "").trim().toUpperCase();
  const discountType = params.discountType === "flat" ? "flat" : "percentage";
  const valueRaw = Number(params.value);
  const value = Number.isFinite(valueRaw) ? Math.max(0, valueRaw) : 0;
  const valueLabel = discountType === "flat" ? `$${formatMoney(value)} off` : `${Math.min(100, Math.max(0, value))}% off`;

  const fromEmailRaw = String(
    process.env.FROM_EMAIL ||
      (process.env.EMAIL_USER ? `CallTechCare <${process.env.EMAIL_USER}>` : "") ||
      "CallTechCare <support@calltechcare.com>"
  ).trim();

  const baseUrl = String(process.env.NEXT_PUBLIC_BASE_URL || "https://www.calltechcare.com").trim();
  const subject = `Your discount code — ${valueLabel}`;

  const html = `
    <div style="background:#f8fafc; padding:24px 12px; font-family:Arial, sans-serif; color:#0b1220;">
      <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden;">
        <div style="padding:18px 18px 14px 18px; background:#0b1220; color:#ffffff;">
          <div style="font-size:12px; letter-spacing:1.2px; opacity:0.9;">CALLTECHCARE</div>
          <div style="font-size:22px; font-weight:800; line-height:1.2; margin-top:8px;">Here’s your ${escapeHtml(valueLabel)} code</div>
          <div style="font-size:13px; opacity:0.9; margin-top:6px;">Use this code at checkout to save on your first service.</div>
        </div>

        <div style="padding:18px;">
          <div style="background:#f1f5f9; border:1px solid #e2e8f0; border-radius:12px; padding:14px 14px; text-align:center;">
            <div style="font-size:11px; letter-spacing:1.4px; color:#334155; font-weight:700;">YOUR DISCOUNT CODE</div>
            <div style="font-size:22px; font-weight:900; letter-spacing:1px; margin-top:8px;">${escapeHtml(code)}</div>
            <div style="font-size:12px; color:#475569; margin-top:8px;">Applies ${escapeHtml(valueLabel)} your first service.</div>
          </div>

          <div style="margin-top:16px; font-size:14px; color:#0b1220;">Ready to book? Click below:</div>

          <div style="margin-top:12px;">
            <a href="${escapeHtml(baseUrl)}" target="_blank" rel="noreferrer"
              style="display:inline-block; background:#0b1220; color:#ffffff; text-decoration:none; padding:12px 16px; border-radius:10px; font-weight:800; font-size:14px;">
              Book a service
            </a>
          </div>

          <div style="margin-top:14px; font-size:12px; color:#64748b;">
            Or copy/paste this link: <a href="${escapeHtml(baseUrl)}" target="_blank" rel="noreferrer" style="color:#0b1220;">${escapeHtml(baseUrl)}</a>
          </div>

          <p style="margin-top:16px; color:#64748b; font-size:12px;">Source: ${escapeHtml(params.source)}</p>
        </div>
      </div>
    </div>
  `;

  // Prefer Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: fromEmailRaw,
        to: [to],
        subject,
        html,
      });
      return { ok: true as const, skipped: false as const, provider: "resend" as const };
    } catch (err) {
      logger.error("Discount code email failed (Resend)", err, { to, source: params.source });
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
    subject,
    html,
  });

  return { ok: true as const, skipped: false as const, provider: "nodemailer" as const };
}
