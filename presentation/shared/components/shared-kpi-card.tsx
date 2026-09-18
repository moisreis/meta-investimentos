import type { ComponentType, JSX } from "react"
import { Badge } from "@/presentation/ui/badge"

interface KpiCardProps {
  title: string
  value: string
  trend?: string
  comparison?: string
  icon?: ComponentType<{ size?: number; stroke?: number }>
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
 * @param props.icon - Optional icon component for the trend.
 *
 * @returns **JSX** element representing the **KPI** card.
 *
 * @example
 * <SharedKpiCard title="Revenue" value="$10k" trend="+12%" />
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
  icon: Icon,
}: KpiCardProps): JSX.Element {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start border-r border-border hover:bg-accent transition-colors">
      <div className="flex h-11 w-full items-center justify-between px-3">
        <span className="font-mono uppercase text-xs text-muted-foreground">
          {title}
        </span>
      </div>

      <div className="flex flex-row items-center gap-3 w-full justify-start px-3">
        <div className="size-3  bg-green-600"></div>
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
