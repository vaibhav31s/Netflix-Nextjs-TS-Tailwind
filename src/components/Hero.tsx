"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { img, type Title } from "@/lib/types";
import { IconCheck, IconInfo, IconPlay, IconPlus, IconStar } from "./icons";
import { ease, spring, useStore } from "./providers";

const HOLD_MS = 9000;

/** The big banner. It cycles through a few picks and pauses while you interact. */
export default function Hero({ picks }: { picks: Title[] }) {
  const { open, has, toggle, modalOpen } = useStore();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = picks[i];

  useEffect(() => {
    if (paused || modalOpen || picks.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setI((n) => (n + 1) % picks.length), HOLD_MS);
    return () => clearTimeout(timer);
  }, [i, paused, modalOpen, picks.length]);

  if (!t) return null;
  const saved = has(t);

  return (
    <section
      className="relative flex min-h-[78svh] items-end overflow-hidden sm:min-h-[86svh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={t.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={img(t.backdrop, "original")}
            alt=""
            fetchPriority={i === 0 ? "high" : "auto"}
            className="kenburns size-full object-cover object-top"
            style={{ animation: `kenburns ${HOLD_MS + 2500}ms ease-out forwards` }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/25 to-transparent" />

      <div className="relative w-full px-4 pb-14 sm:px-10 sm:pb-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease }}
            className="max-w-2xl"
          >
            <p className="mb-3 flex flex-wrap items-center gap-2.5 text-sm font-semibold">
              <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-lime-ink">
                #{i + 1} this week
              </span>
              {t.rating > 0 && (
                <span className="inline-flex items-center gap-1 text-lime">
                  <IconStar /> {t.rating.toFixed(1)}
                </span>
              )}
              <span className="text-white/75">{t.year}</span>
              <span className="text-white/75">{t.type === "tv" ? "Series" : "Film"}</span>
            </p>
            <h1 className="font-display text-[34px] font-bold leading-[1.05] sm:text-6xl">{t.title}</h1>
            <p className="mt-4 line-clamp-3 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-lg">{t.overview}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <motion.button
            type="button"
            onClick={() => open(t, true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="inline-flex h-13 items-center gap-2 rounded-full bg-lime px-7 text-base font-bold text-lime-ink"
          >
            <IconPlay size={18} /> Play trailer
          </motion.button>
          <motion.button
            type="button"
            onClick={() => open(t)}
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="inline-flex h-13 items-center gap-2 rounded-full bg-white/15 px-6 text-base font-semibold backdrop-blur-md hover:bg-white/25"
          >
            <IconInfo size={19} /> More info
          </motion.button>
          <motion.button
            type="button"
            onClick={() => toggle(t)}
            whileTap={{ scale: 0.9 }}
            transition={spring}
            aria-pressed={saved}
            aria-label={saved ? "Remove from My List" : "Add to My List"}
            title={saved ? "Remove from My List" : "Add to My List"}
            className={`grid size-13 place-items-center rounded-full backdrop-blur-md ${saved ? "bg-lime text-lime-ink" : "bg-white/15 hover:bg-white/25"}`}
          >
            {saved ? <IconCheck size={20} strokeWidth={2.6} /> : <IconPlus size={20} />}
          </motion.button>
        </div>

        {picks.length > 1 && (
          <div className="mt-8 flex gap-2" role="tablist" aria-label="Featured titles">
            {picks.map((p, n) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={p.title}
                onClick={() => setI(n)}
                className="relative h-1.5 w-10 overflow-hidden rounded-full bg-white/25"
              >
                {n === i && (
                  <motion.span
                    key={`${i}-${paused || modalOpen}`}
                    className="absolute inset-0 origin-left rounded-full bg-lime"
                    initial={{ scaleX: paused || modalOpen ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: paused || modalOpen ? 0 : HOLD_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
