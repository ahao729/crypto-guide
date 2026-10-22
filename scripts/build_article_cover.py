from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import math

W, H = 1200, 675
OUT = Path("public/images/articles/binance-okx-campaigns-2026.png")
OUT.parent.mkdir(parents=True, exist_ok=True)

# Deep navy → warm black gradient
img = Image.new("RGB", (W, H), "#080b12")
px = img.load()
for y in range(H):
    for x in range(W):
        t = (x / W) * 0.55 + (y / H) * 0.45
        r = int(8 + 18 * t)
        g = int(11 + 14 * t)
        b = int(18 + 8 * t)
        # warm gold glow from bottom-right
        d = math.hypot(x - W * 0.82, y - H * 0.78)
        glow = max(0, 1 - d / 520) ** 2
        r = min(255, int(r + 70 * glow))
        g = min(255, int(g + 50 * glow))
        b = min(255, int(b + 10 * glow))
        px[x, y] = (r, g, b)

# Soft glows
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse((760, 330, 1250, 820), fill=(212, 175, 55, 52))
gd.ellipse((-180, -220, 380, 340), fill=(212, 175, 55, 26))
glow = glow.filter(ImageFilter.GaussianBlur(90))
img = Image.alpha_composite(img.convert("RGBA"), glow)

d = ImageDraw.Draw(img)

# Fine grid
for x in range(0, W, 60):
    d.line((x, 0, x, H), fill=(255, 255, 255, 7), width=1)
for y in range(0, H, 60):
    d.line((0, y, W, y), fill=(255, 255, 255, 7), width=1)

GOLD = (224, 189, 99)
GOLD_LIGHT = (245, 219, 145)
WHITE = (246, 244, 238)
MUTED = (166, 168, 178)
DARK = (12, 15, 22)

def font(path, size, index=0):
    return ImageFont.truetype(path, size, index=index)

regular = font("/System/Library/Fonts/Hiragino Sans GB.ttc", 26)
regular_small = font("/System/Library/Fonts/Hiragino Sans GB.ttc", 22)
bold = font("/System/Library/Fonts/Hiragino Sans GB.ttc", 58)
bold_large = font("/System/Library/Fonts/Hiragino Sans GB.ttc", 64)
mono = font("/System/Library/Fonts/Supplemental/Arial.ttf", 18)
mono_bold = font("/System/Library/Fonts/Supplemental/Arial.ttf", 22)

# Top badge
badge_text = "2026  ·  10 月更新"
bbox = d.textbbox((0, 0), badge_text, font=regular_small)
bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
d.rounded_rectangle((72, 56, 72 + bw + 44, 56 + bh + 26), radius=20, fill=(212, 175, 55, 32), outline=(212, 175, 55, 90), width=1)
d.text((94, 66), badge_text, font=regular_small, fill=GOLD_LIGHT)

# Small label
d.text((74, 132), "BINANCE  ×  OKX", font=mono_bold, fill=GOLD)
d.text((74, 166), "新用户活动，别只看奖励", font=regular, fill=MUTED)

# Main headline
d.text((72, 230), "币安 & OKX", font=bold_large, fill=GOLD_LIGHT)
d.text((72, 314), "新用户活动整理", font=bold_large, fill=WHITE)

# Subline
d.text((76, 414), "官方入口 · 参与条件 · 奖励形式 · 避坑清单", font=regular, fill=(202, 203, 210))

# Gold rule
d.rounded_rectangle((76, 470, 420, 474), radius=2, fill=GOLD)

# Bottom brand
d.text((76, 566), "币圈指南", font=bold, fill=WHITE)
d.text((76, 636), "bqzn.top", font=mono, fill=MUTED)

# Right-side abstract chart card
card = (790, 92, 1130, 470)
d.rounded_rectangle(card, radius=28, fill=(16, 19, 27, 190), outline=(212, 175, 55, 55), width=1)
# chart grid inside card
for y in range(150, 430, 56):
    d.line((824, y, 1096, y), fill=(255, 255, 255, 12), width=1)
for x in range(824, 1100, 54):
    d.line((x, 150, x, 430), fill=(255, 255, 255, 10), width=1)

points = [(830, 392), (866, 360), (902, 372), (938, 318), (974, 334), (1010, 270), (1046, 292), (1082, 220)]
for i in range(len(points) - 1):
    d.line((points[i], points[i + 1]), fill=GOLD, width=4)
for x, y in points:
    d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=GOLD_LIGHT)

# Activity chips inside card
d.rounded_rectangle((824, 118, 958, 152), radius=17, fill=(212, 175, 55, 36))
d.text((840, 124), "新手礼包", font=regular_small, fill=GOLD_LIGHT)
d.rounded_rectangle((970, 118, 1096, 152), radius=17, fill=(255, 255, 255, 16))
d.text((986, 124), "限时活动", font=regular_small, fill=(220, 221, 226))

# Decorative coins (abstract, no logos)
for cx, cy, r, alpha in [(742, 560, 64, 38), (1136, 604, 92, 26), (690, 90, 28, 30)]:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(212, 175, 55, alpha), outline=(245, 219, 145, min(120, alpha + 50)), width=2)
    img = Image.alpha_composite(img, layer)
    d = ImageDraw.Draw(img)

# Vignette
vignette = Image.new("L", (W, H), 0)
vd = ImageDraw.Draw(vignette)
vd.ellipse((-220, -260, W + 220, H + 260), fill=255)
vignette = vignette.filter(ImageFilter.GaussianBlur(180))
dark = Image.new("RGBA", (W, H), (2, 4, 8, 150))
img = Image.composite(img, Image.alpha_composite(img, dark), vignette)

img.convert("RGB").save(OUT, "PNG", optimize=True)
print(OUT, OUT.stat().st_size)
