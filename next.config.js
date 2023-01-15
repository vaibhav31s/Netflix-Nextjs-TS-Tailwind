/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org','rb.gy'],
  },
  ignoreDuringBuilds: true,
}

const { withSuperjson } = require('next-superjson')

module.exports = withSuperjson()(nextConfig)
