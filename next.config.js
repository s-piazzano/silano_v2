const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["silano-3r.fra1.digitaloceanspaces.com"],
    unoptimized: true,
  },
};


module.exports = withNextIntl(nextConfig);
