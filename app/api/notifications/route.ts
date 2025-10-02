import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/app/models/Notification";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    await connectDB();

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ ok: true, notifications });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
