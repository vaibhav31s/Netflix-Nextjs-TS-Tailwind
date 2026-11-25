import type { Metadata } from "next";
import Grid from "@/components/Grid";
import { search } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const results = await search(q);
  return (
    <div className="min-h-[80svh] px-4 pt-32 sm:px-10 md:pt-28">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        {q.length < 2 ? "Search" : results.length ? <>Results for &ldquo;{q}&rdquo;</> : <>Nothing found for &ldquo;{q}&rdquo;</>}
      </h1>
      <p className="mb-8 mt-2 text-muted">
        {q.length < 2
          ? "Type at least two letters in the search box above."
          : results.length
            ? `${results.length} ${results.length === 1 ? "match" : "matches"}`
            : "Check the spelling, or try a shorter name."}
      </p>
      <Grid titles={results} />
    </div>
  );
}
