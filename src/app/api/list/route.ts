import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isMediaType, type Title } from "@/lib/types";

const bad = (message: string, status = 400) => NextResponse.json({ message }, { status });
const MAX_ITEMS = 300;

const path = (v: unknown) => (typeof v === "string" && /^\/[\w.-]{1,80}$/.test(v) ? v : "");

/** Accepts a title from the browser but keeps only safe, sensibly sized fields. */
function clean(raw: unknown): Title | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = Number(r.id);
  if (!isMediaType(r.type) || !Number.isInteger(id) || id <= 0) return null;
  return {
    id,
    type: r.type,
    title: String(r.title ?? "").slice(0, 200) || "Untitled",
    overview: String(r.overview ?? "").slice(0, 2000),
    poster: path(r.poster),
    backdrop: path(r.backdrop),
    year: /^\d{4}$/.test(String(r.year ?? "")) ? String(r.year) : "",
    rating: Math.max(0, Math.min(10, Number(r.rating) || 0)),
  };
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return bad("Please sign in.", 401);
  const rows = await prisma.listItem.findMany({ where: { userId }, orderBy: { addedAt: "desc" } });
  const items: Title[] = rows.map((r) => ({
    id: r.tmdbId,
    type: r.type as Title["type"],
    title: r.title,
    overview: r.overview,
    poster: r.poster,
    backdrop: r.backdrop,
    year: r.year,
    rating: r.rating,
  }));
  return NextResponse.json({ items });
}

/** Add one title, or several at once (used to carry a guest's list into a new account). */
export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return bad("Please sign in.", 401);
  let body: { item?: unknown; items?: unknown };
  try {
    body = await req.json();
  } catch {
    return bad("That request didn't look right.");
  }
  const incoming = (Array.isArray(body.items) ? body.items : [body.item]).slice(0, 60);
  const titles = incoming.map(clean).filter(Boolean) as Title[];
  if (!titles.length) return bad("Nothing to add.");

  if ((await prisma.listItem.count({ where: { userId } })) + titles.length > MAX_ITEMS) {
    return bad("Your list is full. Remove a few titles first.");
  }

  await prisma.listItem.createMany({
    data: titles.map((t) => ({
      userId,
      type: t.type,
      tmdbId: t.id,
      title: t.title,
      overview: t.overview,
      poster: t.poster,
      backdrop: t.backdrop,
      year: t.year,
      rating: t.rating,
    })),
    skipDuplicates: true,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const userId = await currentUserId();
  if (!userId) return bad("Please sign in.", 401);
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const id = Number(url.searchParams.get("id"));
  if (!isMediaType(type) || !Number.isInteger(id)) return bad("Which title?");
  await prisma.listItem.deleteMany({ where: { userId, type, tmdbId: id } });
  return NextResponse.json({ ok: true });
}
