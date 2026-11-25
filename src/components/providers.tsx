"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { keyOf, type Title } from "@/lib/types";
import { IconCheck, IconX } from "./icons";
import TitleModal from "./TitleModal";

export const spring = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;
export const ease = [0.22, 1, 0.36, 1] as const;

type Store = {
  list: Title[];
  ready: boolean;
  has: (t: Title) => boolean;
  toggle: (t: Title) => void;
  open: (t: Title, autoplay?: boolean) => void;
  modalOpen: boolean;
  toast: (text: string, ok?: boolean) => void;
};

const Ctx = createContext<Store | null>(null);
export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

const GUEST_KEY = "reelroom:list";

function readGuest(): Title[] {
  try {
    const raw = JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((t) => t && typeof t.id === "number" && typeof t.title === "string") : [];
  } catch {
    return [];
  }
}
function writeGuest(list: Title[]) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(list.slice(0, 200)));
  } catch {}
}

function StoreProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [list, setList] = useState<Title[]>([]);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<{ title: Title; autoplay: boolean } | null>(null);
  const [toasts, setToasts] = useState<{ id: number; text: string; ok: boolean }[]>([]);
  const nextId = useRef(1);
  const listRef = useRef(list);
  listRef.current = list;

  const toast = useCallback((text: string, ok = true) => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-1), { id, text, ok }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // Signed-in people keep their list in their account; guests keep it in this browser.
  useEffect(() => {
    if (status === "loading") return;
    let cancelled = false;
    (async () => {
      if (status === "authenticated") {
        const guest = readGuest();
        try {
          if (guest.length) {
            // carry over anything saved before signing in
            const res = await fetch("/api/list", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: guest }),
            });
            if (res.ok) writeGuest([]);
          }
          const res = await fetch("/api/list", { cache: "no-store" });
          const body = await res.json();
          if (!cancelled && res.ok) setList(body.items);
        } catch {}
      } else {
        setList(readGuest());
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const has = useCallback((t: Title) => list.some((x) => keyOf(x) === keyOf(t)), [list]);

  const toggle = useCallback(
    (t: Title) => {
      const before = listRef.current;
      const saved = before.some((x) => keyOf(x) === keyOf(t));
      const after = saved ? before.filter((x) => keyOf(x) !== keyOf(t)) : [t, ...before];
      setList(after);
      toast(saved ? `Removed "${t.title}" from My List` : `Added "${t.title}" to My List`);
      if (status !== "authenticated") {
        writeGuest(after);
        return;
      }
      const req = saved
        ? fetch(`/api/list?type=${t.type}&id=${t.id}`, { method: "DELETE" })
        : fetch("/api/list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item: t }),
          });
      req
        .then(async (res) => {
          if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message);
        })
        .catch((e) => {
          setList(before); // put it back the way it was
          toast(e?.message || "Couldn't update your list. Please try again.", false);
        });
    },
    [status, toast]
  );

  const open = useCallback((title: Title, autoplay = false) => setModal({ title, autoplay }), []);

  const value = useMemo(
    () => ({ list, ready, has, toggle, open, modalOpen: modal !== null, toast }),
    [list, ready, has, toggle, open, modal, toast]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {modal && (
          <TitleModal
            key="modal"
            title={modal.title}
            autoplay={modal.autoplay}
            onSwap={(t) => setModal({ title: t, autoplay: false })}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={spring}
              className="flex max-w-md items-center gap-2.5 rounded-full bg-ink py-2.5 pl-3 pr-5 text-sm font-semibold text-bg shadow-2xl"
            >
              <span className={`grid size-6 shrink-0 place-items-center rounded-full ${t.ok ? "bg-lime text-lime-ink" : "bg-bad text-white"}`}>
                {t.ok ? <IconCheck size={14} strokeWidth={3} /> : <IconX size={13} strokeWidth={3} />}
              </span>
              <span className="truncate">{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">
        <StoreProvider>{children}</StoreProvider>
      </MotionConfig>
    </SessionProvider>
  );
}
