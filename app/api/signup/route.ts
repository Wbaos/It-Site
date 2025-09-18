import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";
import bcrypt from "bcryptjs";
import { setAuthCookie, signToken } from "@/lib/auth";

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

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // ✅ Sign token + set cookie
    const token = signToken({
      id: user._id.toString(),
      email,
      name,
    });
    await setAuthCookie(token);

    return NextResponse.json({ ok: true, redirect: "/" });
  } catch (err) {
    console.error("Signup API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
