export type MediaType = "movie" | "tv";

/** A film or show, trimmed down to what the screens need. */
export type Title = {
  id: number;
  type: MediaType;
  title: string;
  overview: string;
  poster: string; // TMDB image path, e.g. "/abc.jpg"
  backdrop: string;
  year: string;
  rating: number;
};

export type TitleDetails = Title & {
  tagline: string;
  genres: string[];
  runtime: string; // "2h 14m" or "3 seasons"
  trailer: string | null; // YouTube video id
  cast: { name: string; role: string; photo: string }[];
  similar: Title[];
};

export type RowData = { id: string; name: string; titles: Title[] };

export const img = (path: string, size: "w185" | "w342" | "w500" | "w780" | "w1280" | "original" = "w342") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

export const keyOf = (t: { type: string; id: number }) => `${t.type}-${t.id}`;

export const isMediaType = (s: unknown): s is MediaType => s === "movie" || s === "tv";
