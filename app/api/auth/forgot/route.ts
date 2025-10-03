import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { sendResetEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email" },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 15;

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetUrl);

    return NextResponse.json({ ok: true, message: "Reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
