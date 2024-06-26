/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          },
        ],
    },
    experimental: {
      serverComponentsExternalPackages: ['puppeteer-core'],
    },
};

export default nextConfig;
