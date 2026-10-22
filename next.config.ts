import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用 X-Powered-By 头，减少信息泄露
  poweredByHeader: false,

  // 压缩响应 (Next.js 16 默认启用，显式声明)
  compress: true,

  // 旧链接兼容：数据库中的 slug 是 gate-io，历史链接/页脚曾使用 gate。
  // 用 301 把外链权重和访问者带到正确页面，避免直接 500。
  async redirects() {
    return [
      {
        source: "/exchanges/gate",
        destination: "/exchanges/gate-io",
        statusCode: 301,
      },
      {
        // Duplicate halving article retired; keep the old URL working.
        source: "/articles/bitcoin-halving-2026-analysis",
        destination: "/articles/bitcoin-halving-2026",
        statusCode: 301,
      },
    ];
  },


  images: {
    // 启用 AVIF 和 WebP 格式以获得更小的图片体积
    formats: ["image/avif", "image/webp"],
    // 定义响应式图片的设备尺寸断点
    deviceSizes: [640, 768, 1024, 1280, 1536],
    // 图片缓存时间 (秒)
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 天
    remotePatterns: [
      {
        // Media library (Cloudflare R2 / S3 public domain)
        protocol: "https",
        hostname: "cdn.bqzn.top",
      },
      {
        // Own domain: article covers may be pasted as absolute bqzn.top URLs
        protocol: "https",
        hostname: "bqzn.top",
      },
      {
        protocol: "https",
        hostname: "www.bqzn.top",
      },
      {
        // R2 default public development domain
        protocol: "https",
        hostname: "**.r2.dev",
      },
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

  // 安全响应头 + HTTP 缓存头
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    // Note: `'unsafe-inline'` is required because Next.js injects inline
    // bootstrap scripts/styles and the pages emit JSON-LD. A nonce-based CSP
    // would be stricter but needs per-request plumbing through proxy + layout.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; ");

    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
      },
    ];

    if (isDev) {
      return [{ source: "/(.*)", headers: securityHeaders }];
    }

    return [
      { source: "/(.*)", headers: securityHeaders },
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
