import { LoadPositions } from "../helpers/load-positions.helper"
import { BuildPositionLookups } from "../helpers/build-position-lookups.helper"
import type { PositionListProps } from "../pages/list"
import type { PositionRow } from "@/presentation/types/position-row.types"
import type { PositionLookups } from "../types/position-list.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { FundRow } from "@/presentation/types/fund-row.types"
import { PositionContainer } from "@/presentation/composition/position.container"

/**
 * @summary
 * Resolves the props for the position list page.
 *
 * @remarks
 * Loads the session positions and their lookups.
 *
 * @returns The position list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadPositionPageProps();
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadPositionPageProps(): Promise<PositionListProps> {
  let data: PositionRow[] | null = null
  let lookups: PositionLookups = { rows: {}, portfolioOptions: [], fundOptions: [] }

  const LOADED = await LoadPositions()

  if (LOADED) {
    const POSITIONS = LOADED.positions
    const LOOKUPS = BuildPositionLookups(LOADED)

    return { data: POSITIONS, lookups: LOOKUPS }
  }

  return { data: null, lookups: { rows: {}, portfolioOptions: [], fundOptions: [] } }
}