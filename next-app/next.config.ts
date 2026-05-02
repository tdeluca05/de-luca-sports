import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite imágenes locales y de dominios externos si se agregan
    unoptimized: true,
  },
};

export default nextConfig;
