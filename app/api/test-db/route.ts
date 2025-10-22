import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        return NextResponse.json(
            { ok: false, error: "❌ MONGODB_URI is undefined in Vercel" },
            { status: 500 }
        );
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log(" MongoDB connected successfully");
        return NextResponse.json({ ok: true, message: "✅ Connected to MongoDB" });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(" Error connecting:", err.message);
            return NextResponse.json(
                { ok: false, error: err.message },
                { status: 500 }
            );
        } else {
            console.error(" Unknown error type:", err);
            return NextResponse.json(
                { ok: false, error: "Unknown connection error" },
                { status: 500 }
            );
        }
    }
}
