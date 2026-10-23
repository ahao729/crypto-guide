import Image from "next/image"
import type { EcosystemBrand } from "@/lib/ecosystem"

export function BrandMark({
  brand,
  size = "md",
}: {
  brand: Pick<EcosystemBrand, "mark" | "logo" | "color" | "name">
  size?: "sm" | "md" | "lg"
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-16 w-16",
  }

  return (
    <span
      aria-label={`${brand.name} 标识`}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white ${sizes[size]}`}
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt=""
          fill
          sizes={size === "lg" ? "64px" : size === "sm" ? "32px" : "44px"}
          className="object-contain p-1.5"
          unoptimized
        />
      ) : (
        <span
          className="text-xs font-bold tracking-tight"
          style={{ color: brand.color }}
        >
          {brand.mark}
        </span>
      )}
    </span>
  )
}
