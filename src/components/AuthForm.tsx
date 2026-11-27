"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Logo } from "./icons";
import { ease, spring } from "./providers";

const problems: Record<string, string> = {
  "use-password": "This email already has a password here. Sign in with your email and password below.",
  google: "Google couldn't confirm that email. Please try again or use a password.",
  OAuthCallback: "Google sign-in didn't finish. Please try again.",
  OAuthSignin: "Couldn't reach Google. Please try again.",
  AccessDenied: "Google sign-in was cancelled.",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.300C33.700 32.700 29.200 36 24 36c-6.600 0-12-5.400-12-12s5.400-12 12-12c3.100 0 5.800 1.200 8 3l5.700-5.700C34 6.100 29.300 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.300-.1-2.600-.4-3.900z" />
      <path fill="#FF3D00" d="M6.300 14.700l6.600 4.800C14.700 15.100 19 12 24 12c3.100 0 5.800 1.200 8 3l5.700-5.700C34 6.100 29.300 4 24 4 16.300 4 9.700 8.300 6.300 14.700z" />
      <path fill="#4CAF50" d="M24 44c5.200 0 9.900-2 13.400-5.200l-6.200-5.200C29.200 35.100 26.700 36 24 36c-5.200 0-9.600-3.300-11.300-7.900l-6.500 5C9.500 39.600 16.200 44 24 44z" />
      <path fill="#1976D2" d="M43.600 20.100H42V20H24v8h11.300c-.8 2.200-2.200 4.200-4.100 5.600l6.200 5.200C37 39.200 44 34 44 24c0-1.300-.1-2.600-.4-3.900z" />
    </svg>
  );
}

export default function AuthForm({ mode, google = false, problem }: { mode: "login" | "register"; google?: boolean; problem?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(problem ? problems[problem] ?? "Couldn't sign you in. Please try again." : "");
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
        {google && (
          <>
            <motion.button
              type="button"
              disabled={busy}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              onClick={() => {
                setBusy(true);
                void signIn("google", { callbackUrl: "/browse" });
              }}
              className="mt-6 flex h-13 w-full items-center justify-center gap-3 rounded-full bg-white text-base font-bold text-[#1f1f1f] disabled:opacity-60"
            >
              <GoogleIcon />
              Continue with Google
            </motion.button>
            <div className="mt-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted" aria-hidden>
              <span className="h-px flex-1 bg-white/10" />
              or
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </>
        )}
        <form onSubmit={submit} className={google ? "mt-5 space-y-3" : "mt-6 space-y-3"}>
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
