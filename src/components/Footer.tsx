export default function Footer() {
  return (
    <footer className="mt-16 border-t px-4 py-10 text-sm text-muted sm:px-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <p className="max-w-md">
          Reelroom is a portfolio project for browsing films and shows and watching their trailers. It doesn't stream
          full films.
        </p>
        <div className="space-y-1.5 sm:text-right">
          <p>
            This product uses the{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="font-semibold text-ink hover:text-lime">
              TMDB
            </a>{" "}
            API but is not endorsed or certified by TMDB.
          </p>
          <p>
            Built by{" "}
            <a href="https://vaibhavgawad.com" className="font-semibold text-ink hover:text-lime">
              Vaibhav Gawad
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
