import type { EcosystemBrand } from "@/lib/ecosystem"

export function BrandMark({
  brand,
  size = "md",
}: {
  brand: Pick<EcosystemBrand, "mark" | "color" | "name">
  size?: "sm" | "md" | "lg"
}) {
  const sizes = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-11 w-11 text-xs",
    lg: "h-16 w-16 text-base",
  }

  return (
    <span
      aria-label={`${brand.name} 标识`}
      className={`inline-flex shrink-0 items-center justify-center rounded-xl border font-bold tracking-tight ${sizes[size]}`}
      style={{
        backgroundColor: `${brand.color}18`,
        borderColor: `${brand.color}40`,
        color: brand.color,
      }}
    >
      {brand.mark}
    </span>
  )
}
