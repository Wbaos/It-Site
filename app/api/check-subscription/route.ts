import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ hasSubscription: false });
        }

        await connectDB();

        const hasSubscription = await Order.exists({
            email: session.user.email,
            isSubscription: true,
        });

        return NextResponse.json({ hasSubscription: !!hasSubscription });
    } catch (err) {
        console.error("check-subscription error:", err);
        return NextResponse.json({ hasSubscription: false });
    }
}
