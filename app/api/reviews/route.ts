import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { sanityWriteClient } from "@/lib/sanityWriteClient";

export async function POST(req: Request) {
    try {
        // Authenticate user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        // Parse multipart form data
        const formData = await req.formData();
        const serviceSlug = formData.get("serviceSlug") as string;
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment") as string;
        const title = formData.get("title") as string;
        const file = formData.get("media") as File | null;

        if (!serviceSlug || !rating || !comment) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let uploadedAsset = null;

        // Upload media to Sanity (if present)
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            uploadedAsset = await sanityWriteClient.assets.upload("file", buffer, {
                filename: file.name,
                contentType: file.type,
            });
        }

        // Build review document
        const reviewDoc = {
            _type: "review",
            userName: session.user?.name || "Anonymous",
            serviceSlug,
            rating,
            comment,
            title,
            approved: false,
            createdAt: new Date().toISOString(),
            ...(uploadedAsset && {
                media: {
                    _type: "file",
                    asset: {
                        _type: "reference",
                        _ref: uploadedAsset._id,
                    },
                },
            }),
        };

        // Save review in Sanity
        const created = await sanityWriteClient.create(reviewDoc);

        return NextResponse.json({
            success: true,
            message: "Review submitted successfully. Awaiting approval.",
            review: created,
        });
    } catch (err: any) {
        console.error("Sanity API error:", err.message || err);
        return NextResponse.json(
            { error: "Failed to submit review", details: err.message },
            { status: 500 }
        );
    }
}
