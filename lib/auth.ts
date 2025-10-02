// // lib/auth.ts
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// const SECRET = process.env.JWT_SECRET || "supersecret";

// export function setAuthCookie(user: { id: string; email: string; name: string }) {
//   const token = jwt.sign(
//     { id: user.id, email: user.email, name: user.name },
//     SECRET,
//     { expiresIn: "7d" }
//   );

//   cookies().set("auth_token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//   });

//   return token;
// }

// export function clearAuthCookie() {
//   cookies().delete("auth_token");
// }

// export function verifyAuth() {
//   const token = cookies().get("auth_token")?.value;
//   if (!token) return null;

//   try {
//     return jwt.verify(token, SECRET) as { id: string; email: string; name: string };
//   } catch {
//     return null;
//   }
// }
