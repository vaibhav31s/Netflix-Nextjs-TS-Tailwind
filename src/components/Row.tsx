"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RowData } from "@/lib/types";
import Card from "./Card";
import { IconLeft, IconRight } from "./icons";
import { ease } from "./providers";

export default function Row({ row, eager = false }: { row: RowData; eager?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, ease }}
      aria-label={row.name}
      className="group/row relative"
    >
      <h2 className="mb-3 px-4 font-display text-lg font-bold sm:px-10 sm:text-xl">{row.name}</h2>
      <div className="relative">
        <div
          ref={track}
          onScroll={measure}
          className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 pb-4 pt-3 sm:gap-4 sm:px-10"
          style={{ scrollPaddingInline: "2.5rem" }}
        >
          {row.titles.map((t, i) => (
            <div key={t.type + t.id} className="w-[38vw] max-w-[200px] shrink-0 snap-start sm:w-[190px]">
              <Card title={t} priority={eager && i < 7} />
            </div>
          ))}
        </div>
        {(["left", "right"] as const).map((side) => {
          const hidden = side === "left" ? edge.start : edge.end;
          return (
            <button
              key={side}
              type="button"
              onClick={() => slide(side === "left" ? -1 : 1)}
              disabled={hidden}
              aria-label={side === "left" ? `Scroll ${row.name} back` : `Scroll ${row.name} forward`}
              className={`absolute top-0 hidden h-full w-14 items-center justify-center from-bg to-transparent transition-opacity duration-300 md:flex ${
                side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"
              } ${hidden ? "pointer-events-none opacity-0" : "opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100"}`}
            >
              <span className="grid size-11 place-items-center rounded-full bg-ink text-bg shadow-xl transition-transform duration-200 hover:scale-110">
                {side === "left" ? <IconLeft size={20} /> : <IconRight size={20} />}
              </span>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
