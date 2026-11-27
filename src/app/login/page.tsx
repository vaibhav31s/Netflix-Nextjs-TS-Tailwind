import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { currentUserId, googleEnabled } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await currentUserId()) redirect("/browse");
  return <AuthForm mode="login" google={googleEnabled} problem={(await searchParams).error} />;
}
