import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function getSessionId() {
  const cookieStore = await cookies();

  let sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set("sessionId", sessionId, {
      httpOnly: true,
      path: "/",
    });
  }

  return sessionId;
}
