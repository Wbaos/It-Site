import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";
import { sanityWriteClient } from "@/lib/sanityWriteClient";

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

    const user = await User.create({ name, email, password });

    try {
      await sanityWriteClient.create({
        _type: "user",
        name,
        email,
        createdAt: new Date().toISOString(),
        source: "website-signup",
      });
    } catch (err) {
      console.error("Sanity archive error:", err);
    }

    return NextResponse.json({ ok: true, redirect: "/login" });
  } catch (err) {
    console.error("Signup API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
