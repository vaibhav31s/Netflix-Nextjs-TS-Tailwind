import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "./db";

/** Accounts made with Google have this in place of a password hash, so they can't be opened with a password. */
export const GOOGLE_MARK = "oauth:google";
export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password.startsWith("$2") || !(await compare(password, user.password))) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    ...(googleEnabled
      ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })]
      : []),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true;
      const p = profile as { email?: string; email_verified?: boolean; name?: string } | undefined;
      const email = String(p?.email ?? "").trim().toLowerCase();
      if (!email || p?.email_verified === false) return "/login?error=google";
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        await prisma.user.create({ data: { email, name: (p?.name || email.split("@")[0]).slice(0, 60), password: GOOGLE_MARK } });
        return true;
      }
      // An account that was made with a password stays password-only, so nobody
      // can get into it just by controlling a matching Google address later.
      return existing.password === GOOGLE_MARK ? true : "/login?error=use-password";
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && token.email) {
        const row = await prisma.user.findUnique({ where: { email: token.email.toLowerCase() }, select: { id: true, name: true } });
        if (row) {
          token.uid = row.id;
          token.name = row.name;
        }
      } else if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.uid as string;
      return session;
    },
  },
};

/** The signed-in person's id, or null. */
export async function currentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}
