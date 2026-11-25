import "server-only";
import type { MediaType, RowData, Title, TitleDetails } from "./types";

// All film data comes from TMDB. Calls happen on the server so the key never reaches the browser.
const BASE = process.env.TMDB_BASE_URL || "https://api.tmdb.org/3";

type Raw = Record<string, any>;

async function tmdb(path: string, params: Record<string, string> = {}, revalidate = 3600): Promise<Raw | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  const url = new URL(BASE + path);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  // v4 tokens are long JWTs sent as a header; v3 keys go in the query string
  const headers: Record<string, string> = { accept: "application/json" };
  if (key.length > 40) headers.authorization = `Bearer ${key}`;
  else url.searchParams.set("api_key", key);
  try {
    const res = await fetch(url, { headers, next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function toTitle(r: Raw, fallback?: MediaType): Title | null {
  const type: unknown = r.media_type ?? fallback;
  if (type !== "movie" && type !== "tv") return null;
  if (!r.poster_path || !r.backdrop_path || r.adult) return null;
  return {
    id: r.id,
    type,
    title: r.title ?? r.name ?? "Untitled",
    overview: r.overview ?? "",
    poster: r.poster_path,
    backdrop: r.backdrop_path,
    year: String(r.release_date ?? r.first_air_date ?? "").slice(0, 4),
    rating: Math.round((r.vote_average ?? 0) * 10) / 10,
  };
}

const list = (data: Raw | null, fallback?: MediaType): Title[] =>
  (data?.results ?? []).map((r: Raw) => toTitle(r, fallback)).filter(Boolean) as Title[];

type RowSpec = { id: string; name: string; path: string; type?: MediaType; params?: Record<string, string> };

const discover = (type: MediaType, genre: string, extra: Record<string, string> = {}) => ({
  path: `/discover/${type}`,
  type,
  params: { with_genres: genre, sort_by: "popularity.desc", "vote_count.gte": "200", include_adult: "false", ...extra },
});

const ROWS: Record<"home" | "movie" | "tv", RowSpec[]> = {
  home: [
    { id: "trending", name: "Trending this week", path: "/trending/all/week" },
    { id: "cinema", name: "In cinemas now", path: "/movie/now_playing", type: "movie" },
    { id: "tv-pop", name: "Shows everyone's watching", path: "/tv/popular", type: "tv" },
    { id: "top", name: "All-time greats", path: "/movie/top_rated", type: "movie" },
    { id: "action", name: "Edge of your seat", ...discover("movie", "28") },
    { id: "comedy", name: "Need a laugh", ...discover("movie", "35") },
    { id: "scifi", name: "Other worlds", ...discover("movie", "878") },
    { id: "tv-top", name: "Shows worth the binge", path: "/tv/top_rated", type: "tv" },
    { id: "animation", name: "Animated favourites", ...discover("movie", "16") },
    { id: "horror", name: "Lights off", ...discover("movie", "27") },
    { id: "docs", name: "True stories", ...discover("movie", "99", { "vote_count.gte": "80" }) },
  ],
  movie: [
    { id: "trending", name: "Trending films", path: "/trending/movie/week", type: "movie" },
    { id: "cinema", name: "In cinemas now", path: "/movie/now_playing", type: "movie" },
    { id: "top", name: "All-time greats", path: "/movie/top_rated", type: "movie" },
    { id: "action", name: "Edge of your seat", ...discover("movie", "28") },
    { id: "comedy", name: "Need a laugh", ...discover("movie", "35") },
    { id: "romance", name: "Love stories", ...discover("movie", "10749") },
    { id: "scifi", name: "Other worlds", ...discover("movie", "878") },
    { id: "thriller", name: "Keep you guessing", ...discover("movie", "53") },
    { id: "animation", name: "Animated favourites", ...discover("movie", "16") },
    { id: "horror", name: "Lights off", ...discover("movie", "27") },
    { id: "upcoming", name: "Coming soon", path: "/movie/upcoming", type: "movie" },
  ],
  tv: [
    { id: "trending", name: "Trending shows", path: "/trending/tv/week", type: "tv" },
    { id: "popular", name: "Shows everyone's watching", path: "/tv/popular", type: "tv" },
    { id: "top", name: "Shows worth the binge", path: "/tv/top_rated", type: "tv" },
    { id: "drama", name: "Big dramas", ...discover("tv", "18") },
    { id: "comedy", name: "Easy laughs", ...discover("tv", "35") },
    { id: "crime", name: "Crime and mystery", ...discover("tv", "80") },
    { id: "scifi", name: "Sci-fi and fantasy", ...discover("tv", "10765") },
    { id: "animation", name: "Animated series", ...discover("tv", "16") },
    { id: "docs", name: "Documentary series", ...discover("tv", "99", { "vote_count.gte": "50" }) },
  ],
};

export async function getRows(section: "home" | "movie" | "tv"): Promise<RowData[]> {
  const rows = await Promise.all(
    ROWS[section].map(async (spec) => ({
      id: spec.id,
      name: spec.name,
      titles: list(await tmdb(spec.path, spec.params), spec.type),
    }))
  );
  return rows.filter((r) => r.titles.length >= 6);
}

export async function search(query: string): Promise<Title[]> {
  const q = query.trim().slice(0, 80);
  if (q.length < 2) return [];
  const data = await tmdb("/search/multi", { query: q, include_adult: "false" }, 600);
  return list(data).sort((a, b) => b.rating - a.rating || 0).slice(0, 40);
}

export async function getDetails(type: MediaType, id: number): Promise<TitleDetails | null> {
  const r = await tmdb(`/${type}/${id}`, { append_to_response: "videos,credits,recommendations" }, 86400);
  if (!r) return null;
  const base = toTitle({ ...r, media_type: type }) ?? {
    id: r.id,
    type,
    title: r.title ?? r.name ?? "Untitled",
    overview: r.overview ?? "",
    poster: r.poster_path ?? "",
    backdrop: r.backdrop_path ?? "",
    year: String(r.release_date ?? r.first_air_date ?? "").slice(0, 4),
    rating: Math.round((r.vote_average ?? 0) * 10) / 10,
  };

  const videos: Raw[] = (r.videos?.results ?? []).filter((v: Raw) => v.site === "YouTube");
  const pick =
    videos.find((v) => v.type === "Trailer" && v.official) ??
    videos.find((v) => v.type === "Trailer") ??
    videos.find((v) => v.type === "Teaser") ??
    videos[0];

  const runtime =
    type === "movie"
      ? r.runtime
        ? `${Math.floor(r.runtime / 60)}h ${r.runtime % 60}m`
        : ""
      : r.number_of_seasons
        ? `${r.number_of_seasons} ${r.number_of_seasons === 1 ? "season" : "seasons"}`
        : "";

  return {
    ...base,
    tagline: r.tagline ?? "",
    genres: (r.genres ?? []).map((g: Raw) => g.name).slice(0, 4),
    runtime,
    trailer: pick && /^[\w-]{6,20}$/.test(pick.key) ? pick.key : null,
    cast: (r.credits?.cast ?? []).slice(0, 8).map((c: Raw) => ({
      name: c.name,
      role: c.character ?? "",
      photo: c.profile_path ?? "",
    })),
    similar: list(r.recommendations, type).slice(0, 12),
  };
}

export const hasKey = () => Boolean(process.env.TMDB_API_KEY);
