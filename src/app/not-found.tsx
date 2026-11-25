import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center px-4 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-lime">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">This scene didn't make the final cut</h1>
        <p className="mt-2 text-muted">The page you're after doesn't exist.</p>
        <Link href="/browse" className="mt-6 inline-flex h-12 items-center rounded-full bg-lime px-6 font-bold text-lime-ink">
          Back to browsing
        </Link>
      </div>
    </div>
  );
}
