import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/app/models/Service";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q")?.trim() || "";

        await connectDB();

        const results = await Service.find({
            title: { $regex: q, $options: "i" },
        }).limit(10);

        return NextResponse.json({ results });
    } catch (err) {
        console.error("Search error:", err);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
