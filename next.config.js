/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["silano-3r.fra1.digitaloceanspaces.com"],
    unoptimized: true,
  },
  transpilePackages: ['next-mdx-remote'],
  async headers() {
    return [
      {
        // Applica il CSP a tutte le pagine
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
             default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.snipcart.com https://app.snipcart.com;
              style-src 'self' 'unsafe-inline' https://cdn.snipcart.com https://app.snipcart.com https://fonts.bunny.net;
              img-src 'self' data: https: silano-3r.fra1.digitaloceanspaces.com https://cdn.snipcart.com https://app.snipcart.com;
              font-src 'self' https: https://cdn.snipcart.com https://fonts.bunny.net;
              connect-src 'self' https://app.snipcart.com https://cdn.snipcart.com;
              frame-src https://www.google.com https://www.google.com/maps https://app.snipcart.com;
              object-src 'none';
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};


module.exports = nextConfig;
