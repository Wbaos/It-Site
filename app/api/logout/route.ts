import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // ✅ await here
  cookieStore.set("auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // delete immediately
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
