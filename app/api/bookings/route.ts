import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/app/models/Booking";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Save booking in MongoDB
    const booking = await Booking.create({
      ...data,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, booking });
  } catch (err: any) {
    console.error(" Booking error:", err.message);
    return NextResponse.json(
      { error: "Failed to save booking" },
      { status: 500 }
    );
  }
}
