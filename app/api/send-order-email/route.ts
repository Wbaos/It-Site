import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = process.env.FROM_EMAIL || "orders@calltechcare.com";
const REPLY_TO = process.env.REPLY_TO_EMAIL || FROM_EMAIL;
const BCC_EMAIL = process.env.BCC_EMAIL || "";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(" Incoming email payload:", body);

        const { customerEmail, serviceTitle, basePrice, addOns, total } = body || {};

        if (!customerEmail) {
            console.warn("⚠️ Missing customerEmail field in request body");
            return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
        }

        const safeAddOns = Array.isArray(addOns) ? addOns : [];
        const addOnsList =
            safeAddOns.length > 0
                ? safeAddOns
                    .map((o: any) => {
                        const name = typeof o?.name === "string" ? o.name : "Add-on";
                        const price = Number(o?.price || 0).toFixed(2);
                        return `<li>${name}: $${price}</li>`;
                    })
                    .join("")
                : "<li>No add-ons selected</li>";

        const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color:#111;">
        <h2 style="margin:0 0 12px;">Thank you for your order!</h2>
        <p style="margin:0 0 12px;">Here’s a summary of your booking with <strong>CallTechCare</strong>:</p>

        <p><strong>Service:</strong> ${serviceTitle ?? "—"}</p>
        <p><strong>Base Price:</strong> $${Number(basePrice || 0).toFixed(2)}</p>

        <p style="margin-top:10px;"><strong>Add-ons:</strong></p>
        <ul style="padding-left:20px;">${addOnsList}</ul>

        <hr style="border:none; border-top:1px solid #eee; margin:16px 0;" />
        <h3>Total: $${Number(total || 0).toFixed(2)}</h3>

        <p style="margin:12px 0 0;">We'll contact you soon to confirm your appointment.</p>
        <p style="color:#555;">— The CallTechCare Team</p>
      </div>
    `;

        const response = await resend.emails.send({
            from: `CallTechCare <${FROM_EMAIL}>`,
            to: [customerEmail],
            ...(BCC_EMAIL ? { bcc: [BCC_EMAIL] } : {}),
            replyTo: REPLY_TO,
            subject: `Your CallTechCare Order — ${serviceTitle ?? "Confirmation"}`,
            html: htmlContent,
        });

        console.log("✅ Email sent:", response);
        return NextResponse.json({ success: true, id: response?.data?.id ?? null });
    } catch (error: any) {
        console.error(" Resend email error:", error);

        const message =
            error?.message ||
            error?.response?.data?.message ||
            "Failed to send email";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
