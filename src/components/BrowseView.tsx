import type { RowData } from "@/lib/types";
import Hero from "./Hero";
import Row from "./Row";

export default function BrowseView({ rows }: { rows: RowData[] }) {
  if (rows.length === 0) {
    return (
      <div className="grid min-h-[70svh] place-items-center px-4 pt-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold">The projector is warming up</h1>
          <p className="mx-auto mt-3 max-w-md text-muted">
            We couldn't reach the film catalogue just now. Please refresh in a moment.
          </p>
        </div>
      </div>
    );
  }
  // Feature a few titles that have a proper description.
  const picks = rows[0].titles.filter((t) => t.overview.length > 60).slice(0, 5);
  return (
    <>
      <Hero picks={picks} />
      <div className="relative z-10 -mt-8 space-y-8 sm:space-y-10">
        {rows.map((row, i) => (
          <Row key={row.id} row={row} eager={i === 0} />
        ))}
      </div>
    </>
  );
}
