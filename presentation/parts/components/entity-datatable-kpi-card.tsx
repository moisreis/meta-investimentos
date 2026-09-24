import type { ComponentType, JSX } from "react"
import { Badge } from "@/presentation/ui/badge"
import { cn } from "cn"

export type KpiDotIndicator = "negative" | "alert" | "success"

interface KpiCardProps {
  title: string
  value: string
  trend?: string
  comparison?: string
  dotIndicator?: KpiDotIndicator
  icon?: ComponentType<{ size?: number; stroke?: number }>
}

const DOT_INDICATOR_CLASSES: Record<KpiDotIndicator, string> = {
  negative: "bg-red-600",
  alert: "bg-yellow-600",
  success: "bg-green-600",
}

export function EntityDatatableKpiCard({
  title,
  value,
  trend,
  comparison,
  dotIndicator,
  icon: Icon,
}: KpiCardProps): JSX.Element {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start border-r border-border transition-colors hover:bg-accent">
      <div className="flex h-11 w-full items-center justify-between px-3">
        <span className="font-sans text-xs text-muted-foreground">
          {title}
        </span>
      </div>

      <div className="flex w-full flex-row items-center justify-start gap-3 px-3">
        {dotIndicator && (
          <div
            className={cn(
              "size-3 rounded-full",
              DOT_INDICATOR_CLASSES[dotIndicator]
            )}
            role="img"
            aria-label={`Status: ${dotIndicator}`}
          />
        )}
        <span className="text-2xl font-semibold">{value}</span>
      </div>

      {(trend || comparison) && (
        <div className="flex h-11 w-full items-center justify-start gap-2 px-3">
          {trend && (
            <Badge variant="secondary" className="rounded-full">
              {Icon && <Icon size={16} stroke={2} />}
              {trend}
            </Badge>
          )}

          {comparison && (
            <span className="text-xs text-muted-foreground">
              {comparison}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
