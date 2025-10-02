import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/app/models/Notification";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    await connectDB();

    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Mark read error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
