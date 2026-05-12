import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["finnhub"],
  images: {
    remotePatterns: [
      { hostname: "coin-images.coingecko.com" },
      { hostname: "assets.coingecko.com" },
    ],
  },
};

export default nextConfig;
