import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ hasSubscription: false });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        const hasSubscription = !!user?.stripeCustomerId;
        return NextResponse.json({ hasSubscription });
    } catch (err) {
        console.error("Error checking subscription:", err);
        return NextResponse.json({ hasSubscription: false });
    }
}
