import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";
import bcrypt from "bcryptjs";
import { setAuthCookie, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Sign token + set cookie
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });
    await setAuthCookie(token);

    return NextResponse.json({ ok: true, redirect: "/" });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
