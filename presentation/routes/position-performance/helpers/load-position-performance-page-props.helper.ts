import { LoadPositionPerformances } from "../helpers/load-position-performances.helper"
import { BuildPositionPerformanceLookups } from "../helpers/build-position-performance-lookups.helper"
import type { PositionPerformanceListProps } from "../pages/list"

/**
 * @summary
 * Resolves the props for the position performance list page.
 *
 * @remarks
 * Loads the calculated position performances and their lookups.
 *
 * @returns The position performance list props, or empty
 * props when there is no active session.
 *
 * @example
 * const PROPS = await LoadPositionPerformancePageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadPositionPerformancePageProps(): Promise<PositionPerformanceListProps> {
  const LOADED = await LoadPositionPerformances()

  if (LOADED) {
    const PERFORMANCES = LOADED.performances
    const LOOKUPS = BuildPositionPerformanceLookups(LOADED)

    return { data: PERFORMANCES, lookups: LOOKUPS }
  }

  return {
    data: null,
    lookups: {
      rows: {},
      positionOptions: [],
      calculationOptions: [],
    },
  }
}
