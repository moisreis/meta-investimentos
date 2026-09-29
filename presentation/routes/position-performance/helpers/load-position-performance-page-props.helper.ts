import { LoadPositionPerformances } from "../helpers/load-position-performances.helper"
import { BuildPositionPerformanceLookups } from "../helpers/build-position-performance-lookups.helper"
import type { PositionPerformanceListProps } from "../pages/list"
import type { PositionPerformanceRow } from "@/presentation/types/position-performance-row.types"
import type { PositionPerformanceLookups } from "../types/position-performance-list.types"
import type { PositionRow } from "@/presentation/types/position-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { FundRow } from "@/presentation/types/fund-row.types"
import { PositionContainer } from "@/presentation/composition/position.container"

/**
 * @summary
 * Resolves the props for the position performance list page.
 *
 * @remarks
 * Loads the calculated position performances and their lookups.
 *
 * @returns The position performance list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadPositionPerformancePageProps();
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadPositionPerformancePageProps(): Promise<PositionPerformanceListProps> {
  let data: PositionPerformanceRow[] | null = null
  let lookups: PositionPerformanceLookups = { rows: {}, positionOptions: [], calculationOptions: [] }

  const LOADED = await LoadPositionPerformances()

  if (LOADED) {
    const PERFORMANCES = LOADED.performances
    const LOOKUPS = BuildPositionPerformanceLookups(LOADED)

    return { data: PERFORMANCES, lookups: LOOKUPS }
  }

  return { data: null, lookups: { rows: {}, positionOptions: [], calculationOptions: [] } }
}