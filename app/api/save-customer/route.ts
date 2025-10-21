import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";

export async function POST(req: Request) {
    try {
        const { userId, customerId } = await req.json();

        if (!userId || !customerId) {
            return NextResponse.json({ error: "Missing userId or customerId" }, { status: 400 });
        }

        await connectDB();
        await User.findByIdAndUpdate(userId, { stripeCustomerId: customerId });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error saving Stripe customer:", err);
        return NextResponse.json({ error: "Failed to save Stripe customer ID" }, { status: 500 });
    }
}
