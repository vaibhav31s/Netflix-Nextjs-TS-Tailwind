# Reelroom

Find something good to watch: browse trending films and shows, watch trailers, search, and keep your own list.

**Live:** https://reelroom.vaibhavgawad.com

This started life as a streaming-site clone built while learning Next.js. It has since been rebuilt with its own name and look, and everything now works end to end.

## What works

- Home, Films and Shows pages with a rotating banner and scrollable rows (data from TMDB, refreshed hourly)
- Details pop-up with trailer, cast and "more like this"
- Search that updates as you type
- **My List**: works straight away as a guest (saved in the browser); create a free account and it follows you to every device
- Email + password accounts (passwords hashed with bcrypt)

## Built with

Next.js (App Router) · React · Tailwind CSS · Framer Motion · NextAuth · Prisma · Postgres (Neon)

## Run it yourself

```bash
cp .env.example .env   # add a free TMDB key and a Postgres URL
npm install
npx prisma db push
npm run dev
```

This product uses the TMDB API but is not endorsed or certified by TMDB. It shows trailers only and does not stream full films.
