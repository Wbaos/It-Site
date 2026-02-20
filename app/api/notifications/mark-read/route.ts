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
      return NextResponse.json({ ok: true });
    }
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
