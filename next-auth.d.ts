import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    phone?: string | null; // ✅ allow phone on the user object
  }

  interface Session extends DefaultSession {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null; // ✅ allow phone in the session
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    phone?: string | null; // ✅ allow phone in JWT
  }
}
