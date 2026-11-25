import type { Metadata } from "next";
import BrowseView from "@/components/BrowseView";
import { getRows } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Browse" };
// The catalogue is refreshed every hour.
export const revalidate = 3600;

export default async function Page() {
  return <BrowseView rows={await getRows("home")} />;
}
