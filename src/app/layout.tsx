import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const body = Manrope({ subsets: ["latin"], variable: "--ff-body", display: "swap" });
const display = Unbounded({ subsets: ["latin"], variable: "--ff-display", display: "swap", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: { default: "Reelroom · Find something good to watch", template: "%s · Reelroom" },
  description:
    "Browse what's trending in films and shows, watch trailers, and keep a list of what you want to see next.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#0b0b0e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
