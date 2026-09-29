import type { ComponentType, JSX } from "react"

import { Badge } from "@/presentation/ui/badge"
import { cn } from "cn"

import type { KpiDotIndicator } from "@/presentation/parts/components/entity-datatable-kpi-card"

interface EntityDetailKpiCardProps {
  title: string
  value: string
  trend?: string
  comparison?: string
  dotIndicator?: KpiDotIndicator
  icon?: ComponentType<{ size?: number; stroke?: number }>
  headerIcon?: ComponentType<{ size?: number; stroke?: number }>
}

const DOT_INDICATOR_CLASSES: Record<KpiDotIndicator, string> = {
  negative: "bg-red-600",
  alert: "bg-yellow-600",
  success: "bg-green-600",
}

/**
 * @summary
 * Renders a KPI card of an entity detail screen.
 *
 * @remarks
 * The card is fully data-driven: every piece of copy comes
 * from the caller, so a card label and its value can never
 * be divorced from the data behind them. The title sits in
 * the header next to its entity icon, the status dot leads
 * the value in the body and the footer carries the signed
 * trend badge with its direction icon and the comparison
 * caption. Rendering nothing when the trend or the
 * comparison is absent keeps sparse cards from collapsing.
 *
 * @param props - Props of the detail KPI card.
 * @param props.title - The card title, as `uppercase` copy.
 * @param props.value - The formatted KPI value.
 * @param props.trend - The signed movement, shown in the
 *                      badge when present.
 * @param props.comparison - The comparison caption of the
 *                           value, shown when present.
 * @param props.dotIndicator - The sign of the card, painted
 *                             as the dot beside the value.
 * @param props.icon - The direction icon rendered beside
 *                     the trend text.
 * @param props.headerIcon - The entity icon decorating the
 *                           header, opposite the title.
 *
 * @returns The detail KPI card.
 *
 * @example
 * <EntityDetailKpiCard
 *   title="Patrimônio"
 *   value="R$ 73.639,02"
 *   trend="+ 1,29%"
 *   comparison="desde 30/06/2026"
 *   dotIndicator="success"
 *   icon={IconTrendingUp}
 *   headerIcon={IconWallet}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export function EntityDetailKpiCard({
  title,
  value,
  trend,
  comparison,
  dotIndicator,
  icon: Icon,
  headerIcon: HeaderIcon,
}: EntityDetailKpiCardProps): JSX.Element {
  return (
    <div className="rounded-md border border-border bg-sidebar p-1.5">
      <div className="flex flex-row items-center justify-between py-1 pb-1.5">
        <h2 className="font-sans text-xs font-medium text-muted-foreground uppercase">
          {title}
        </h2>

        {HeaderIcon && (
          <span className="text-muted-foreground">
            <HeaderIcon size={16} stroke={2} />
          </span>
        )}
      </div>

      <div className="flex h-24 flex-col justify-between gap-2 rounded-md border border-border bg-background p-3">
        <div className="flex flex-row items-center gap-2">
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

          <span className="font-heading text-2xl font-semibold">
            {value}
          </span>
        </div>

        {(trend || comparison) && (
          <div className="flex flex-row items-center justify-between gap-2">
            {trend && (
              <Badge variant="outline">
                {Icon && <Icon size={16} stroke={2} />}
                {trend}
              </Badge>
            )}

            {comparison && (
              <span className="text-xs font-normal text-muted-foreground">
                {comparison}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}