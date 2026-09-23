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

/**
 * @summary
 * Renders a **KPI** metric card with optional trend data.
 *
 * @remarks
 * Displays **KPI** values with secondary elements like trend
 * percentages and comparison text.
 *
 * @explanation
 * Provides a standardized visual presentation for dashboard
 * **KPI** metrics.
 *
 * @param props - Component properties.
 * @param props.title - **KPI** label displayed above value.
 * @param props.value - Primary **KPI** metric value.
 * @param props.trend - Optional trend indicator string.
 * @param props.comparison - Optional comparison reference.
 * @param props.dotIndicator - Optional color-coded status dot shown next
 * to the value. Accepts `"negative"` (red), `"alert"` (yellow) or
 * `"success"` (green).
 * @param props.icon - Optional icon component for the trend.
 *
 * @returns **JSX** element representing the **KPI** card.
 *
 * @example
 * <SharedKpiCard title="Revenue" value="$10k" trend="+12%" dotIndicator="success" />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export function SharedKpiCard({
  title,
  value,
  trend,
  comparison,
  dotIndicator,
  icon: Icon,
}: KpiCardProps): JSX.Element {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start border-r border-border hover:bg-accent transition-colors">
      <div className="flex h-11 w-full items-center justify-between px-3">
        <span className="font-sans text-xs text-muted-foreground">
          {title}
        </span>
      </div>

      <div className="flex flex-row items-center gap-3 w-full justify-start px-3">
        {dotIndicator && (
          <div
            className={cn(
              "size-3 rounded-full",
              DOT_INDICATOR_CLASSES[dotIndicator],
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
            <span className="text-xs text-muted-foreground">{comparison}</span>
          )}
        </div>
      )}
    </div>
  )
}
