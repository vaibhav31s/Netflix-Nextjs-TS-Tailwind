import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";

const bad = (message: string, status = 400) => NextResponse.json({ message }, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("That request didn't look right.");
  }
  const name = String(body.name ?? "").trim().slice(0, 60);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 160);
  const password = String(body.password ?? "");

  if (name.length < 2) return bad("Please tell us your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("That email doesn't look right.");
  if (password.length < 8) return bad("Use a password with at least 8 characters.");
  if (password.length > 200) return bad("That password is too long.");

  try {
    const taken = await prisma.user.findUnique({ where: { email }, select: { password: true } });
    if (taken) {
      return bad(
        taken.password.startsWith("oauth:")
          ? "This email already signed up with Google. Use the Google button to sign in."
          : "You already have an account with this email. Try signing in."
      );
    }
    await prisma.user.create({ data: { name, email, password: await hash(password, 10) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("signup failed", err);
    return bad("Something went wrong on our side. Please try again.", 500);
  }
}
