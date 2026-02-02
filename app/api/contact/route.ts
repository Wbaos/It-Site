// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/app/models/Contact";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";
import { logger } from "@/lib/logger";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const company = String(body.company || "").trim(); 

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    const newContact = await Contact.create({
      name,
      email,
      message,
      company,
      date: new Date(),
    });

    let emailSent = false;
    let mailchimpSynced = false;

    // Best-effort Mailchimp sync (do not block contact on marketing platform failures)
    try {
      if (
        process.env.MAILCHIMP_API_KEY &&
        process.env.MAILCHIMP_SERVER_PREFIX &&
        process.env.MAILCHIMP_AUDIENCE_ID
      ) {
        const fullName = String(name ?? "").trim();
        const parts = fullName ? fullName.split(/\s+/) : [];
        const firstName = parts[0] || undefined;
        const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;

        await syncCustomerToMailchimp({
          email: String(email),
          firstName,
          lastName,
          serviceType: "contact-form",
        });

        mailchimpSynced = true;
      }
    } catch (err) {
      logger.error("Mailchimp sync failed during contact", err, {
        email,
        source: "contact",
      });
    }

    const toEmail = process.env.EMAIL_TO;
    const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_USER || "support@calltechcare.com";
    const bccEmail = process.env.BCC_EMAIL;

    const subjectLine = "📩 New Contact Form Submission";
    const htmlBody = `
          <h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          ${company ? `<p><b>Company:</b> ${company}</p>` : ""}
          <p><b>Message:</b><br>${message}</p>
          <hr>
          <p><small>Received: ${new Date().toLocaleString()}</small></p>
        `;

    // Prefer Resend if available (already used elsewhere in this repo)
    if (resend && toEmail) {
      try {
        await resend.emails.send({
          from: `CallTechCare <${fromEmail}>`,
          to: [toEmail],
          ...(bccEmail ? { bcc: [bccEmail] } : {}),
          replyTo: email,
          subject: subjectLine,
          html: htmlBody,
        });
        emailSent = true;
      } catch (err) {
        console.warn("⚠️ Contact email send failed (Resend).", err);
      }
    } else {
      // Fallback to Nodemailer (Gmail) if configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !toEmail) {
        console.warn("⚠️ Email notifications not configured (missing RESEND_API_KEY or EMAIL_* vars). Contact was saved to DB.");
      } else {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"CallTechCare Website" <${process.env.EMAIL_USER}>`,
          to: toEmail,
          ...(bccEmail ? { bcc: bccEmail } : {}),
          replyTo: email,
          subject: subjectLine,
          html: htmlBody,
        });

        emailSent = true;
      }
    }

    return NextResponse.json({ ok: true, id: newContact._id, emailSent, mailchimpSynced });
  } catch (err: any) {
    console.error("❌ Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
