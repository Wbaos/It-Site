import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone } = body;

        await connectDB();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: { name, phone } },
            { new: true }
        ).lean();

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user: updatedUser });
    } catch (err) {
        console.error("Profile update error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
