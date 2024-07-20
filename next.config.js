const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // typescript: {
  //    // !! WARN !!
  //    // Dangerously allow production builds to successfully complete even if
  //    // your project has type errors.
  //    // !! WARN !!
  //    ignoreBuildErrors: true,
  // },
}

module.exports = withPWA(nextConfig)
