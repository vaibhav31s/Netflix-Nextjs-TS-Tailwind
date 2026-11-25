"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { IconLogout, IconSearch, IconX, Logo } from "./icons";
import { spring, useStore } from "./providers";

const LINKS = [
  { href: "/browse", label: "Home" },
  { href: "/films", label: "Films" },
  { href: "/shows", label: "Shows" },
  { href: "/my-list", label: "My List" },
];

export default function Nav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const { list } = useStore();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState(pathname === "/search" ? (params?.get("q") ?? "") : "");
  const menuRef = useRef<HTMLDivElement>(null);
  const typing = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/search") setQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menu]);

  // Results update as you type, after a short pause.
  const onType = (value: string) => {
    setQuery(value);
    if (typing.current) clearTimeout(typing.current);
    typing.current = setTimeout(() => {
      const q = value.trim();
      if (q) router.replace(`/search?q=${encodeURIComponent(q)}`);
      else if (pathname === "/search") router.replace("/browse");
    }, 320);
  };

  const name = session?.user?.name ?? "";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ${
        solid ? "bg-bg/85 backdrop-blur-xl" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-6 sm:px-10">
        <Link href="/browse" aria-label="Reelroom home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const on = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={on ? "page" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${on ? "text-lime-ink" : "text-white/75 hover:text-white"}`}
              >
                {on && <motion.span layoutId="nav-pill" transition={spring} className="absolute inset-0 rounded-full bg-lime" />}
                <span className="relative">
                  {l.label}
                  {l.href === "/my-list" && list.length > 0 && (
                    <span className={`ml-1.5 text-xs tabular-nums ${on ? "opacity-70" : "text-lime"}`}>{list.length}</span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = query.trim();
            if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
          className="relative ml-auto min-w-0 flex-1 md:max-w-[280px] md:flex-none md:w-[280px]"
        >
          <IconSearch size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" />
          <input
            type="search"
            value={query}
            onChange={(e) => onType(e.target.value)}
            placeholder="Search"
            aria-label="Search films and shows"
            className="h-10 w-full rounded-full border border-white/15 bg-black/40 pl-10 pr-9 text-sm backdrop-blur placeholder:text-white/50 focus:border-lime focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => onType("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-white/60 hover:text-white">
              <IconX size={14} />
            </button>
          )}
        </form>

        {status === "authenticated" ? (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-label="Account menu"
              aria-expanded={menu}
              className="grid size-10 place-items-center rounded-full bg-lime font-bold text-lime-ink"
            >
              {name.trim()[0]?.toUpperCase() ?? "?"}
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={spring}
                  style={{ transformOrigin: "top right" }}
                  className="absolute right-0 top-12 w-60 rounded-2xl border bg-surface p-2 shadow-2xl"
                >
                  <div className="px-3 py-2.5">
                    <p className="truncate text-sm font-bold">{name}</p>
                    <p className="truncate text-xs text-muted">{session?.user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-surface-2"
                  >
                    <IconLogout size={17} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link href="/login" className="inline-flex h-10 shrink-0 items-center rounded-full bg-white/15 px-4 text-sm font-semibold backdrop-blur hover:bg-white/25">
            Sign in
          </Link>
        )}
      </div>

      {/* Phone: links sit under the bar */}
      <nav aria-label="Main" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
        {LINKS.map((l) => {
          const on = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={on ? "page" : undefined}
              className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold ${on ? "text-lime-ink" : "text-white/80"}`}
            >
              {on && <motion.span layoutId="nav-pill-m" transition={spring} className="absolute inset-0 rounded-full bg-lime" />}
              <span className="relative">{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
