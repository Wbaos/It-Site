import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        await connectDB();

        if (!session?.user?.email) {
            return NextResponse.json({ orders: [] });
        }

        const orders = await Order.find({ email: session.user.email })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ orders });
    } catch (err) {
        console.error("Orders fetch error:", err);
        return NextResponse.json({ orders: [] });
    }
}
