import type { NextConfig } from 'next';

// Deployed Fly.io backend (see backend/fly.toml). Override with API_PROXY_TARGET
// for local dev, staging, or an alternate API host.
const PRODUCTION_API_ORIGIN = 'https://energy-market-viz-api.fly.dev';

function resolveApiOrigin(): string {
  const explicit = process.env.API_PROXY_TARGET?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : PRODUCTION_API_ORIGIN;
}

const apiOrigin = resolveApiOrigin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
