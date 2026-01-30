import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { sanityWriteClient } from "@/lib/sanityWriteClient";
import { syncCustomerToMailchimp } from "@/lib/mailchimp";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    await User.create({ name, email, password });

    // Best-effort Mailchimp sync (do not block signup on marketing platform failures)
    try {
      const fullName = String(name ?? "").trim();
      const parts = fullName ? fullName.split(/\s+/) : [];
      const firstName = parts[0] || undefined;
      const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;

      if (
        process.env.MAILCHIMP_API_KEY &&
        process.env.MAILCHIMP_SERVER_PREFIX &&
        process.env.MAILCHIMP_AUDIENCE_ID
      ) {
        await syncCustomerToMailchimp({
          email: String(email),
          firstName,
          lastName,
        });
      }
    } catch (err) {
      logger.error("Mailchimp sync failed during signup", err, {
        email,
        source: "signup",
      });
    }

    try {
      await sanityWriteClient.create({
        _type: "user",
        name,
        email,
        createdAt: new Date().toISOString(),
        source: "website-signup",
      });
    } catch (err) {
      logger.error("Sanity archive error", err, { email });
    }

    return NextResponse.json({ ok: true, redirect: "/login" });
  } catch (err) {
    logger.error("Signup API error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
