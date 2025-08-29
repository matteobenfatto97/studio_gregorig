/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  eslint: {
    ignoreDuringBuilds: true, // ✅ la build non fallisce per errori ESLint
  },
};

export default nextConfig;
