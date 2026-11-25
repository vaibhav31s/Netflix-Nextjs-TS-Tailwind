"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Title } from "@/lib/types";
import Card from "./Card";
import { spring } from "./providers";

export default function Grid({ titles }: { titles: Title[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <AnimatePresence mode="popLayout" initial={false}>
        {titles.map((t) => (
          <motion.li
            key={t.type + t.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={spring}
          >
            <Card title={t} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
