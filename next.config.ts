import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用 X-Powered-By 头，减少信息泄露
  poweredByHeader: false,

  // 压缩响应 (Next.js 16 默认启用，显式声明)
  compress: true,

  images: {
    // 启用 AVIF 和 WebP 格式以获得更小的图片体积
    formats: ["image/avif", "image/webp"],
    // 定义响应式图片的设备尺寸断点
    deviceSizes: [640, 768, 1024, 1280, 1536],
    // 图片缓存时间 (秒)
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 天
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "**.svgur.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },

  // HTTP 缓存头配置
  async headers() {
    if (process.env.NODE_ENV === "development") {
      return []
    }

    return [
      {
        source: "/:path*.(ico|png|jpg|jpeg|webp|avif|svg|woff|woff2|ttf|eot)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(js|css)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
