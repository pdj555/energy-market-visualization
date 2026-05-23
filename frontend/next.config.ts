import type { NextConfig } from 'next';

function resolveApiOrigin(): string {
  const explicit = process.env.API_PROXY_TARGET?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }

  const hint = process.env.VERCEL
    ? 'Set API_PROXY_TARGET in Vercel project environment variables.'
    : 'Set API_PROXY_TARGET in .env.local or export it before building.';

  throw new Error(`API_PROXY_TARGET is required for production builds. ${hint}`);
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
