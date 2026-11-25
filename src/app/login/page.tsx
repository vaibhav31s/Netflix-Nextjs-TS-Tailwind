import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { currentUserId } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function Page() {
  if (await currentUserId()) redirect("/browse");
  return <AuthForm mode="login" />;
}
