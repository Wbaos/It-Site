// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/app/models/Contact";
import nodemailer from "nodemailer";

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

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      console.warn("⚠️ Missing email environment variables.");
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
        to: process.env.EMAIL_TO,
        subject: `📩 New Contact Form Submission`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          ${company ? `<p><b>Company:</b> ${company}</p>` : ""}
          <p><b>Message:</b><br>${message}</p>
          <hr>
          <p><small>Received: ${new Date().toLocaleString()}</small></p>
        `,
      });
    }

    return NextResponse.json({ ok: true, id: newContact._id });
  } catch (err: any) {
    console.error("❌ Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
