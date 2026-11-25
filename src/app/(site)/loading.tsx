export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="shimmer h-[78svh] w-full" />
      <div className="mt-8 flex gap-4 overflow-hidden px-4 sm:px-10">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="shimmer aspect-[2/3] w-[190px] shrink-0 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
