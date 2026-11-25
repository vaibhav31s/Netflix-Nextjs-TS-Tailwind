"use client";

import { motion } from "framer-motion";
import { img, type Title } from "@/lib/types";
import { IconCheck, IconPlus, IconStar } from "./icons";
import { spring, useStore } from "./providers";

/** A poster you can open, with a quick "save" button that shows on hover. */
export default function Card({ title, priority = false }: { title: Title; priority?: boolean }) {
  const { open, has, toggle } = useStore();
  const saved = has(title);
  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -8 }}
      transition={spring}
    >
      <button
        type="button"
        onClick={() => open(title)}
        aria-label={`${title.title}${title.year ? ", " + title.year : ""}`}
        className="relative block w-full overflow-hidden rounded-2xl bg-surface shadow-lg shadow-black/40"
      >
        <img
          src={img(title.poster, "w342")}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="aspect-[2/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        <span className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="line-clamp-2 text-sm font-bold leading-tight">{title.title}</span>
          <span className="mt-1 flex items-center gap-2 text-xs text-white/75">
            {title.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 font-bold text-lime">
                <IconStar size={11} /> {title.rating.toFixed(1)}
              </span>
            )}
            {title.year}
            <span>{title.type === "tv" ? "Series" : "Film"}</span>
          </span>
        </span>
      </button>
      <motion.button
        type="button"
        onClick={() => toggle(title)}
        whileTap={{ scale: 0.85 }}
        transition={spring}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${title.title} from My List` : `Add ${title.title} to My List`}
        title={saved ? "Remove from My List" : "Add to My List"}
        className={`absolute right-2 top-2 grid size-9 place-items-center rounded-full backdrop-blur transition-opacity duration-300 ${
          saved
            ? "bg-lime text-lime-ink opacity-100"
            : "bg-black/65 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        }`}
      >
        {saved ? <IconCheck size={16} strokeWidth={3} /> : <IconPlus size={16} strokeWidth={2.6} />}
      </motion.button>
    </motion.div>
  );
}
