"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { img, type Title, type TitleDetails } from "@/lib/types";
import { IconCheck, IconPlay, IconPlus, IconStar, IconX } from "./icons";
import { ease, spring, useStore } from "./providers";

export default function TitleModal({
  title,
  autoplay,
  onSwap,
  onClose,
}: {
  title: Title;
  autoplay: boolean;
  onSwap: (t: Title) => void;
  onClose: () => void;
}) {
  const { has, toggle } = useStore();
  const [details, setDetails] = useState<TitleDetails | null>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const wantPlay = useRef(autoplay);
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    let cancelled = false;
    setDetails(null);
    setFailed(false);
    setPlaying(false);
    scroller.current?.scrollTo({ top: 0 });
    fetch(`/api/title/${title.type}/${title.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: TitleDetails) => {
        if (cancelled) return;
        setDetails(d);
        if (wantPlay.current && d.trailer) setPlaying(true);
        wantPlay.current = false;
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [title.id, title.type]);

  // Esc closes, Tab stays inside, the page behind doesn't scroll.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>("button, a[href], iframe");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, []);

  const saved = has(title);
  const d = details;

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />
      <div ref={scroller} className="no-scrollbar absolute inset-0 overflow-y-auto overscroll-contain" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <motion.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={title.title}
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="relative mx-auto min-h-full w-full max-w-4xl overflow-hidden bg-surface sm:my-10 sm:min-h-0 sm:rounded-[28px] sm:border"
        >
          <button
            type="button"
            data-close
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
          >
            <IconX size={18} />
          </button>

          {/* Picture or trailer */}
          <div className="relative aspect-video w-full bg-black">
            {playing && d?.trailer ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${d.trailer}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={`${title.title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 size-full"
              />
            ) : (
              <>
                {title.backdrop && (
                  <img src={img(title.backdrop, "w1280")} alt="" className="absolute inset-0 size-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-7">
                  <h2 className="max-w-2xl font-display text-2xl font-bold leading-tight sm:text-4xl">{title.title}</h2>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      transition={spring}
                      disabled={!d?.trailer}
                      onClick={() => setPlaying(true)}
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-lime px-6 font-bold text-lime-ink disabled:bg-surface-2 disabled:text-muted"
                    >
                      <IconPlay size={18} />
                      {d ? (d.trailer ? "Play trailer" : "No trailer yet") : failed ? "Trailer unavailable" : "Loading…"}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      transition={spring}
                      onClick={() => toggle(title)}
                      aria-pressed={saved}
                      className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 bg-black/40 px-5 font-semibold backdrop-blur hover:bg-black/60"
                    >
                      {saved ? <IconCheck size={18} /> : <IconPlus size={18} />}
                      {saved ? "In My List" : "My List"}
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-5 sm:p-8">
            {playing && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold sm:text-2xl">{title.title}</h2>
                <button
                  type="button"
                  onClick={() => toggle(title)}
                  aria-pressed={saved}
                  className="inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold hover:bg-surface-2"
                >
                  {saved ? <IconCheck size={17} /> : <IconPlus size={17} />}
                  {saved ? "In My List" : "My List"}
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
              {title.rating > 0 && (
                <span className="inline-flex items-center gap-1 font-bold text-lime">
                  <IconStar /> {title.rating.toFixed(1)}
                </span>
              )}
              {title.year && <span>{title.year}</span>}
              {d?.runtime && <span>{d.runtime}</span>}
              <span className="rounded-md border px-1.5 py-0.5 text-xs uppercase">{title.type === "tv" ? "Series" : "Film"}</span>
              {d?.genres.map((g) => (
                <span key={g} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink">
                  {g}
                </span>
              ))}
            </div>

            {d?.tagline && <p className="mt-4 text-lg font-semibold italic text-ink/90">{d.tagline}</p>}
            <p className="mt-3 max-w-3xl leading-relaxed text-ink/85">
              {title.overview || d?.overview || "No description available for this one yet."}
            </p>

            {failed && (
              <p className="mt-6 rounded-2xl bg-surface-2 p-4 text-sm text-muted">
                We couldn't load the extra details right now. Please try again in a moment.
              </p>
            )}

            {!d && !failed && (
              <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="shimmer aspect-square rounded-full" />
                ))}
              </div>
            )}

            {d && d.cast.length > 0 && (
              <section className="mt-8">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted">Cast</h3>
                <ul className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
                  {d.cast.map((c, i) => (
                    <motion.li
                      key={c.name + i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                      className="w-20 shrink-0 text-center"
                    >
                      <div className="mx-auto grid size-[72px] place-items-center overflow-hidden rounded-full bg-surface-2 text-lg font-bold text-muted">
                        {c.photo ? (
                          <img src={img(c.photo, "w185")} alt="" loading="lazy" className="size-full object-cover" />
                        ) : (
                          c.name[0]
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-tight">{c.name}</p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{c.role}</p>
                    </motion.li>
                  ))}
                </ul>
              </section>
            )}

            {d && d.similar.length > 0 && (
              <section className="mt-8">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted">More like this</h3>
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {d.similar.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => onSwap(s)}
                        aria-label={s.title}
                        className="group block w-full overflow-hidden rounded-xl bg-surface-2"
                      >
                        <img
                          src={img(s.poster, "w342")}
                          alt=""
                          loading="lazy"
                          className="aspect-[2/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
