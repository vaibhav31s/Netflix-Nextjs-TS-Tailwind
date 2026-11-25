import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = ({ size = 20, ...p }: P) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const IconPlay = ({ size = 20, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M7 4.500v15a1 1 0 0 0 1.500.860l12.500-7.500a1 1 0 0 0 0-1.720L8.500 3.640A1 1 0 0 0 7 4.500Z" /></svg>
);
export const IconPlus = (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>;
export const IconCheck = (p: P) => <svg {...base(p)}><path d="m5 12.500 4.500 4.500L19 7.500" /></svg>;
export const IconX = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const IconInfo = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5.500M12 7.500v.2" /></svg>;
export const IconSearch = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="6.500" /><path d="m20 20-4.200-4.200" /></svg>;
export const IconLeft = (p: P) => <svg {...base(p)}><path d="m15 5-7 7 7 7" /></svg>;
export const IconRight = (p: P) => <svg {...base(p)}><path d="m9 5 7 7-7 7" /></svg>;
export const IconArrow = (p: P) => <svg {...base(p)}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
export const IconStar = ({ size = 14, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="m12 2.500 2.900 6.100 6.600.900-4.800 4.600 1.200 6.600L12 17.500l-5.900 3.200 1.200-6.600L2.500 9.500l6.600-.900L12 2.500Z" /></svg>
);
export const IconLogout = (p: P) => <svg {...base(p)}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M10 16l-4-4 4-4" /><path d="M6 12h9" /></svg>;
export const IconBookmark = (p: P) => <svg {...base(p)}><path d="M6.500 4h11a1 1 0 0 1 1 1v15.500L12 16l-6.500 4.500V5a1 1 0 0 1 1-1Z" /></svg>;

export const Logo = ({ size = 30 }: { size?: number }) => (
  <span className="inline-flex items-center gap-2.5">
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill="#c8f751" />
      <path d="M12 9.500v13l11-6.500z" fill="#131800" />
    </svg>
    <span className="font-display text-[17px] font-bold tracking-tight">reelroom</span>
  </span>
);
