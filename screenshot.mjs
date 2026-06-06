import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000/articles/crypto-market-review-2026-q1", {
  waitUntil: "networkidle",
  timeout: 30000,
});

await page.waitForTimeout(2000);

// Full page screenshot
await page.screenshot({ path: "screenshots/article-fullpage.png", fullPage: true });

// Viewport screenshot
await page.screenshot({ path: "screenshots/article-viewport.png", fullPage: false });

// Get page content structure info
const info = await page.evaluate(() => {
  const pre = document.querySelectorAll(".article-content pre");
  const codeBlocks = document.querySelectorAll(".article-content pre code");
  const figures = document.querySelectorAll(".article-content figure");
  const images = document.querySelectorAll(".article-content img");
  const headings = document.querySelectorAll(".article-content h2, .article-content h3");
  const coverImages = document.querySelectorAll("img.cover-image, [class*='cover']");
  const contentWidth = document.querySelector(".article-content")?.getBoundingClientRect();
  
  return {
    preCount: pre.length,
    codeBlockCount: codeBlocks.length,
    figureCount: figures.length,
    imageCount: images.length,
    headingCount: headings.length,
    coverImageCount: coverImages.length,
    contentWidth: contentWidth ? `${contentWidth.width}px` : "unknown",
    hasOverflowPre: Array.from(pre).some(p => p.scrollWidth > p.clientWidth),
    headingIds: Array.from(headings).map(h => ({ id: h.id, text: h.textContent?.slice(0, 50) })),
  };
});

console.log("Page info:", JSON.stringify(info, null, 2));

await browser.close();
