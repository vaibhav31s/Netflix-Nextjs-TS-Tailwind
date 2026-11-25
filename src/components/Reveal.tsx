"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "./providers";

export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay }}>
      {children}
    </motion.div>
  );
}
