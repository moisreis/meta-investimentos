"use client"

import type { ComponentType } from "react"
import { useMemo } from "react"
import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import type { KpiDotIndicator } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"

// Props of an entity KPI card.
export interface EntityKpi {
  key: string
  title: string
  value: string
  trend?: string
  comparison?: string
  dotIndicator?: KpiDotIndicator
  icon?: ComponentType<{ size?: number; stroke?: number }>
}

interface UseEntityKpisInput<TData> {
  items: readonly TData[]
  compute: (items: readonly TData[]) => EntityKpi[]
}

/**
 * @summary
 * Formats a ratio with an explicit sign for the badge.
 *
 * @param ratio - The ratio to format.
 *
 * @returns The signed percentage string.
 *
 * @example
 * const TREND = FormatEntityKpiTrend(0.042);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FormatEntityKpiTrend(ratio: number): string {
  if (ratio === 0) return "+ 0,00%"
  const SIGN = ratio < 0 ? "-" : "+"
  return `${SIGN} ${FormatPercentage(Math.abs(ratio))}`
}

/**
 * @summary
 * Resolves the trend badge data from a nullable ratio.
 *
 * @param ratio - The ratio or `null` when unavailable.
 *
 * @returns The card trend props.
 *
 * @example
 * const TREND = ResolveEntityKpiTrend(RATIO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function ResolveEntityKpiTrend(ratio: number | null): {
  trend: string | undefined
  dotIndicator: KpiDotIndicator | undefined
  icon:
    ComponentType<{ size?: number; stroke?: number }> | undefined
} {
  if (ratio === null || !Number.isFinite(ratio)) {
    return {
      trend: undefined,
      dotIndicator: undefined,
      icon: undefined,
    }
  }

  const POSITIVE = ratio >= 0

  return {
    trend: FormatEntityKpiTrend(ratio),
    dotIndicator: POSITIVE ? "success" : "negative",
    icon: POSITIVE ? IconTrendingUp : IconTrendingDown,
  }
}

/**
 * @summary
 * Builds the KPI cards of an entity list page.
 *
 * @remarks
 * The entity-specific computation lives in the `compute`
 * callback, which receives the rows and returns the card
 * props. The hook memoizes the result against the rows and
 * the callback identity.
 *
 * @param input - The rows and the compute callback.
 *
 * @returns The KPI card props.
 *
 * @example
 * const KPIS = useEntityKpis({
 *   items: PORTFOLIOS,
 *   compute: buildPortfolioKpis,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useEntityKpis<TData>({
  items,
  compute,
}: UseEntityKpisInput<TData>): EntityKpi[] {
  return useMemo(() => compute(items), [compute, items])
}

export { useEntityKpis }
