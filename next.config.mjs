/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remotion ships native compositor binaries per platform; webpack can't bundle them.
    // Mark the renderer/bundler/serverless stack as external so it runs from node_modules.
    serverComponentsExternalPackages: [
      "@remotion/bundler",
      "@remotion/renderer",
      "@remotion/compositor-darwin-arm64",
      "@remotion/compositor-darwin-x64",
      "@remotion/compositor-linux-arm64-gnu",
      "@remotion/compositor-linux-arm64-musl",
      "@remotion/compositor-linux-x64-gnu",
      "@remotion/compositor-linux-x64-musl",
      "@remotion/compositor-win32-x64-msvc",
      "@remotion/lambda",
      "@remotion/media-parser",
      "@remotion/serverless",
      "remotion",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Also tell webpack to treat these as node externals when used from server code.
      const externals = config.externals || [];
      config.externals = [
        ...(Array.isArray(externals) ? externals : [externals]),
        { "@remotion/bundler": "commonjs @remotion/bundler" },
        { "@remotion/renderer": "commonjs @remotion/renderer" },
      ];
    }
    return config;
  },
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
  async rewrites() {
    return [
      {
        // Shareable deep link. /credits stays in the URL bar and serves the
        // studio page; the page scrolls to the credits section on mount
        // (see app/studio/page.tsx — hash redirects drop the fragment).
        source: "/credits",
        destination: "/studio",
      },
    ];
  },
};

export default nextConfig;
