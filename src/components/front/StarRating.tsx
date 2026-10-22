import { cn, toFiveStarRating } from "@/lib/utils"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  className?: string
  showValue?: boolean
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 14,
  className,
  showValue = true,
}: StarRatingProps) {
  const normalized = toFiveStarRating(rating)
  const fullStars = Math.floor(normalized)
  const hasHalfStar =
    normalized - fullStars >= 0.25 && normalized - fullStars < 0.75
  const adjustedFull =
    normalized - fullStars >= 0.75 ? fullStars + 1 : fullStars

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, i) => {
          const isFilled = i < adjustedFull
          const isHalf = hasHalfStar && i === fullStars
          return (
            <Star
              key={i}
              size={size}
              className={cn(
                "transition-colors",
                isFilled
                  ? "fill-gold text-gold"
                  : isHalf
                    ? "fill-gold/40 text-gold"
                    : "fill-muted-foreground/20 text-muted-foreground/20"
              )}
            />
          )
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-muted-foreground">
          {normalized.toFixed(1)}
        </span>
      )}
    </div>
  )
}
