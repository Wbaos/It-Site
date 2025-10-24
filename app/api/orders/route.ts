import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        await connectDB();

        if (!session?.user) {
            return NextResponse.json({ orders: [] });
        }

        const query = {
            $or: [
                { userId: session.user.id },
                { email: session.user.email },
            ],
        };

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ orders });
    } catch (err) {
        console.error("Orders fetch error:", err);
        return NextResponse.json({ orders: [] });
    }
}
