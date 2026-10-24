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

// Text colour per indicator. The dot carries the state, so
// the card itself never changes ink.
const DOT_INDICATOR_CLASSES: Record<KpiDotIndicator, string> = {
  negative: "bg-red-600",
  alert: "bg-yellow-600",
  success: "bg-green-600",
}

/**
 * @summary
 * Renders one KPI card of the strip of a list screen.
 *
 * @remarks
 * The card holds a figure and the two lines that explain it:
 * the label that names what the figure measures, and the
 * trend and the comparison that sit under it.
 *
 * The card keeps a floor of its own width, so a strip that
 * scrolls on a narrow screen never squeezes a figure into a
 * column too thin to read it. The floor is dropped once the
 * screen is wide enough to share the width, which is what
 * lets four cards sit side by side on a desktop.
 *
 * The comparison is the one line that gives way: it is the
 * least load-bearing text on the card, so it truncates
 * instead of pushing the figure off the card.
 *
 * @explanation
 * Use this card inside the KPI group of a list screen. The
 * group owns the strip and the card owns the figure, so a
 * screen with one card and a screen with four read the same.
 *
 * @param props - Props of the KPI card.
 * @param props.title - Label naming what the figure measures.
 * @param props.value - The figure, already formatted.
 * @param props.trend - The signed trend of the figure.
 * @param props.comparison - The qualifier of the figure.
 * @param props.dotIndicator - The state of the figure.
 * @param props.icon - The icon of the trend badge.
 *
 * @returns The KPI card.
 *
 * @example
 * <EntityDatatableKpiCard
 *   title="Patrimônio Total"
 *   value="R$ 1.234.567,89"
 *   dotIndicator="success"
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
export function EntityDatatableKpiCard({
  title,
  value,
  trend,
  comparison,
  dotIndicator,
  icon: Icon,
}: KpiCardProps): JSX.Element {
  return (
    <div className="flex h-full min-w-64 flex-1 flex-col items-center justify-start border-r border-border transition-colors last:border-r-0 hover:bg-accent sm:min-w-0">
      <div className="flex h-11 w-full items-center justify-between px-3">
        <span className="truncate font-sans text-xs text-muted-foreground">
          {title}
        </span>
      </div>

      <div className="flex w-full flex-row items-center justify-start gap-3 px-3">
        {dotIndicator && (
          <div
            className={cn(
              "size-3 shrink-0 rounded-full",
              DOT_INDICATOR_CLASSES[dotIndicator]
            )}
            role="img"
            aria-label={`Status: ${dotIndicator}`}
          />
        )}
        <span className="text-xl font-semibold break-words tabular-nums sm:text-2xl">
          {value}
        </span>
      </div>

      {(trend || comparison) && (
        <div className="flex h-11 w-full items-center justify-start gap-2 px-3">
          {trend && (
            <Badge
              variant="secondary"
              className="shrink-0 rounded-full"
            >
              {Icon && <Icon size={16} stroke={2} />}
              {trend}
            </Badge>
          )}

          {comparison && (
            <span className="truncate text-xs text-muted-foreground">
              {comparison}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
