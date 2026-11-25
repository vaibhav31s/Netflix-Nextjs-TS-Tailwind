import { NextResponse } from "next/server";
import { getDetails } from "@/lib/tmdb";
import { isMediaType } from "@/lib/types";

export async function GET(_req: Request, ctx: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await ctx.params;
  const n = Number(id);
  if (!isMediaType(type) || !Number.isInteger(n) || n <= 0) {
    return NextResponse.json({ message: "Unknown title." }, { status: 400 });
  }
  const details = await getDetails(type, n);
  if (!details) return NextResponse.json({ message: "We couldn't find that one." }, { status: 404 });
  return NextResponse.json(details, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
