// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// export async function POST(req: Request) {
//   try {
//     const { service, issue } = await req.json();

//     if (!service || !issue) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const client = await clientPromise;
//     const db = client.db("caretech");
//     const issues = db.collection("issues");

//     const result = await issues.insertOne({
//       service,
//       issue,
//       createdAt: new Date(),
//     });

//     return NextResponse.json({ ok: true, id: result.insertedId });
//   } catch (err) {
//     console.error("Issue API error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
