/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        // /solutions was retired in the v3 redesign; send the legacy /advisor path home.
        source: "/advisor",
        destination: "/",
        permanent: true,
      },
    ];
  },
}

export default nextConfig
