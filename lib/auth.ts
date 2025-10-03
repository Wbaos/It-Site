// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// const SECRET = process.env.JWT_SECRET || "supersecret";

// export async function setAuthCookie(user: {
//   id: string;
//   email: string;
//   name: string;
// }) {
//   const token = jwt.sign(
//     { id: user.id, email: user.email, name: user.name },
//     SECRET,
//     { expiresIn: "7d" }
//   );

//   const cookieStore = await cookies();
//   cookieStore.set("auth_token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7,
//   });

//   return token;
// }

// export async function clearAuthCookie() {
//   const cookieStore = await cookies();
//   cookieStore.delete("auth_token");
// }

// export async function verifyAuth() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("auth_token")?.value;
//   if (!token) return null;

//   try {
//     return jwt.verify(token, SECRET) as {
//       id: string;
//       email: string;
//       name: string;
//     };
//   } catch {
//     return null;
//   }
// }
