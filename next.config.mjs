/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dmj9mlo6o/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/studio",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
