"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Grid from "@/components/Grid";
import { IconArrow, IconBookmark } from "@/components/icons";
import { useStore } from "@/components/providers";

export default function MyList() {
  const { list, ready } = useStore();
  const { status } = useSession();

  return (
    <div className="min-h-[80svh] px-4 pt-32 sm:px-10 md:pt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">My List</h1>
          <p className="mt-2 text-muted">
            {!ready ? "Fetching your list…" : list.length === 0 ? "Nothing saved yet." : `${list.length} ${list.length === 1 ? "title" : "titles"} saved for later.`}
          </p>
        </div>
        {ready && status === "unauthenticated" && list.length > 0 && (
          <Link href="/register" className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold hover:bg-surface">
            Create a free account to keep this list on every device <IconArrow size={15} />
          </Link>
        )}
      </div>

      {!ready ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer aspect-[2/3] rounded-2xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="grid place-items-center rounded-[28px] border border-dashed px-6 py-20 text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-lime text-lime-ink">
            <IconBookmark size={28} />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold">Save things to watch later</h2>
          <p className="mt-2 max-w-sm text-muted">Tap the + on any film or show and it will be waiting for you here.</p>
          <Link href="/browse" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-lime px-6 font-bold text-lime-ink">
            Find something <IconArrow size={17} />
          </Link>
        </div>
      ) : (
        <Grid titles={list} />
      )}
    </div>
  );
}
