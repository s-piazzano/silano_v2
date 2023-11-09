/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["it"],
    defaultLocale: "it",
  },
  images: {
    domains: ["silano-3r.fra1.digitaloceanspaces.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig;

