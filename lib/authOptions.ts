import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({ email: credentials?.email });
                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || "",
                    phone: user.phone || "",
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            // Preserve id on first login
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.phone = user.phone;
            }

            //  Keep data fresh but don't remove id
            if (token.email) {
                await connectDB();
                const freshUser = await User.findOne({ email: token.email });
                if (freshUser) {
                    token.id = freshUser._id.toString();
                    token.name = freshUser.name || "";
                    token.phone = freshUser.phone || "";
                }
            }

            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.phone = token.phone as string;
            }
            return session;
        },
    },
};
