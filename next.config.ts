import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Compression
  compress: true,
  
  // Environment variables configuration
  env: {
    // Make environment variables available to the client-side
    // Only add variables that are safe to expose to the browser
    // Server-side variables are automatically available in API routes and SSR
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog'],
  },
  
  // Bundle analyzer (only when ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: NextConfig['webpack']) => {
      if (config && 'plugins' in config && Array.isArray(config.plugins)) {
        config.plugins.push(
          bundleAnalyzer({
            enabled: true,
          })
        );
      }
      return config;
    },
  }),
};

export default nextConfig;
