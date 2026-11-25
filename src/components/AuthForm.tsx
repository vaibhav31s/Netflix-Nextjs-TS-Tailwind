"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Logo } from "./icons";
import { ease, spring } from "./providers";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const register = mode === "register";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (register) {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message);
      }
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res || res.error) {
        throw new Error(
          res?.error === "CredentialsSignin" ? "That email and password don't match." : "Couldn't sign you in. Please try again."
        );
      }
      router.replace("/browse");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-svh place-items-center px-4 py-24">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-lime opacity-[0.09] blur-[120px]" />
      <Link href="/" className="absolute left-4 top-5 sm:left-10" aria-label="Reelroom home">
        <Logo />
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease }}
        className="relative w-full max-w-[430px] rounded-[28px] border bg-surface/80 p-6 backdrop-blur-xl sm:p-8"
      >
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{register ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-muted">
          {register ? "Free forever. Your list follows you to every device." : "Sign in to pick up your list."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {register && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Your name</span>
              <input className="field" autoComplete="name" required minLength={2} maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="What should we call you?" />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Email</span>
            <input className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Password</span>
            <input className="field" type="password" autoComplete={register ? "new-password" : "current-password"} required minLength={register ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={register ? "At least 8 characters" : "Your password"} />
          </label>
          <AnimatePresence>
            {error && (
              <motion.p key={error} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} role="alert" className="overflow-hidden text-sm font-semibold text-bad">
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button type="submit" disabled={busy} whileTap={{ scale: 0.97 }} transition={spring} className="!mt-5 h-13 w-full rounded-full bg-lime text-base font-bold text-lime-ink disabled:opacity-60">
            {busy ? "One moment…" : register ? "Create account" : "Sign in"}
          </motion.button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          {register ? "Already have an account? " : "New here? "}
          <Link href={register ? "/login" : "/register"} className="font-bold text-ink underline decoration-lime decoration-2 underline-offset-4">
            {register ? "Sign in" : "Create a free account"}
          </Link>
        </p>
        <p className="mt-3 text-center text-sm">
          <Link href="/browse" className="text-muted hover:text-ink">
            Or just browse without an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
