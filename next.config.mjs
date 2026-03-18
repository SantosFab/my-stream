/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/watch/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://vidlink.pro https://vsembed.ru;",
          },
        ],
      },
    ]
  },
}

export default nextConfig
