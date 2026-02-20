import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/app/models/Notification";

export async function POST(req: Request) {
  try {

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    try {
      await req.json();
    } catch {
      // no-op
    }

    if (!userId) {
      return NextResponse.json({ ok: true, notifications: [] });
    }
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
