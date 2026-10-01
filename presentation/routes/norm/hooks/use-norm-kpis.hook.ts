"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import type { NormRow } from "@/presentation/types/norm-row.types"

import { NORM_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the norm list.
 *
 * @remarks
 * Tallies the registered norms, the distinct categories
 * they cover and the mean target allocation. Counts are
 * formatted through the count presenter and the mean
 * through the percentage presenter.
 *
 * @param norms - The rows of the norm list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BuildNormKpis(norms: readonly NormRow[]): EntityKpi[] {
  const CATEGORIES = new Set(
    norms.map((norm) => norm.categoryId)
  )

  const TARGETS = norms
    .map((norm) => Number.parseFloat(norm.targetAllocation))
    .filter((value) => Number.isFinite(value))

  const AVERAGE_TARGET =
    TARGETS.length > 0
      ? TARGETS.reduce((sum, value) => sum + value, 0) /
        TARGETS.length
      : 0

  return [
    {
      key: "norms",
      title: NORM_KPI.NORM_COUNT_TITLE,
      value: FormatCount(norms.length),
      comparison: NORM_KPI.NORM_COUNT_COMPARISON,
    },
    {
      key: "categories",
      title: NORM_KPI.CATEGORY_COUNT_TITLE,
      value: FormatCount(CATEGORIES.size),
      comparison: NORM_KPI.CATEGORY_COUNT_COMPARISON,
    },
    {
      key: "averageTarget",
      title: NORM_KPI.AVERAGE_TARGET_TITLE,
      value: FormatPercentage(AVERAGE_TARGET),
      comparison: NORM_KPI.AVERAGE_TARGET_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the norm list.
 *
 * @remarks
 * Delegates the computation to `BuildNormKpis` and the
 * memoization to the shared entity KPI hook.
 *
 * @param norms - The rows of the norm list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useNormKpis(norms: NormRow[]): EntityKpi[] {
  const compute = useCallback(
    (items: readonly NormRow[]) => BuildNormKpis(items),
    []
  )

  return useEntityKpis({
    items: norms,
    compute,
  })
}

export { useNormKpis }
