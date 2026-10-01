import { LoadPositions } from "../helpers/load-positions.helper"
import { BuildPositionLookups } from "../helpers/build-position-lookups.helper"
import type { PositionListProps } from "../pages/list"

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
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadPositionPageProps(): Promise<PositionListProps> {
  const LOADED = await LoadPositions()

  if (LOADED) {
    const POSITIONS = LOADED.positions
    const LOOKUPS = BuildPositionLookups(LOADED)

    return { data: POSITIONS, lookups: LOOKUPS }
  }

  return {
    data: null,
    lookups: { rows: {}, portfolioOptions: [], fundOptions: [] },
  }
}
