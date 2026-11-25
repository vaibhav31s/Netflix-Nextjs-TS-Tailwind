import Link from "next/link";
import { IconArrow, IconBookmark, IconPlay, IconSearch, Logo } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { getRows } from "@/lib/tmdb";
import { img } from "@/lib/types";

export const revalidate = 3600;

export default async function Welcome() {
  const rows = await getRows("home");
  const posters = [...new Map(rows.flatMap((r) => r.titles).map((t) => [t.poster, t])).values()].slice(0, 48);
  const columns = Array.from({ length: 6 }, (_, c) => posters.filter((_, i) => i % 6 === c));

  return (
    <div className="relative min-h-svh overflow-hidden">
      {/* drifting wall of posters */}
      <div aria-hidden className="absolute inset-0 -rotate-6 scale-125 opacity-60">
        <div className="grid h-full grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
          {columns.map((col, c) => (
            <div key={c} className={c > 2 ? "hidden sm:block" : ""}>
              <div
                className="drift flex flex-col gap-3 sm:gap-4"
                style={{ animation: `drift ${70 + c * 14}s linear infinite`, animationDirection: c % 2 ? "reverse" : "normal" }}
              >
                {[...col, ...col].map((t, i) => (
                  <img key={i} src={img(t.poster, "w342")} alt="" loading="lazy" className="aspect-[2/3] w-full rounded-xl object-cover" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,11,14,0.72)_0%,rgba(11,11,14,0.94)_62%,#0b0b0e_100%)]" />

      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-10">
        <Logo />
        <Link href="/login" className="inline-flex h-10 items-center rounded-full bg-white/12 px-5 text-sm font-semibold backdrop-blur hover:bg-white/20">
          Sign in
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100svh-80px)] max-w-4xl flex-col items-center justify-center px-4 pb-16 text-center">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            <span className="size-2 rounded-full bg-lime" /> Free. No card. No catch.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 font-display text-[40px] font-bold leading-[1.04] sm:text-7xl">
            Find something <span className="text-lime">good</span> to watch tonight.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            See what's trending in films and shows, watch the trailers, and keep a list of everything you want to see next.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/browse"
              className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-lime px-8 text-base font-bold text-lime-ink transition-transform duration-300 hover:scale-[1.04] active:scale-95"
            >
              <IconPlay size={18} /> Start browsing
              <IconArrow size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex h-14 items-center rounded-full border border-white/20 bg-black/40 px-7 text-base font-semibold backdrop-blur hover:bg-white/10"
            >
              Create a free account
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.36}>
          <ul className="mt-16 grid gap-3 text-left sm:grid-cols-3">
            {[
              [IconPlay, "Trailers in one tap", "Open any title and the trailer plays right there."],
              [IconSearch, "Search everything", "Thousands of films and shows, found as you type."],
              [IconBookmark, "Your own list", "Save what looks good. Sign in to keep it everywhere."],
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof IconPlay;
              return (
                <li key={title as string} className="rounded-3xl border border-white/10 bg-black/45 p-5 backdrop-blur">
                  <span className="grid size-10 place-items-center rounded-full bg-lime text-lime-ink">
                    <I size={18} />
                  </span>
                  <p className="mt-3 font-bold">{title as string}</p>
                  <p className="mt-1 text-sm text-white/65">{text as string}</p>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </main>
    </div>
  );
}
