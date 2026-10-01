"use client"

import type { PositionAddOption } from "../types/withdrawal-add.types"

interface UseWithdrawalPositionScopeOptions {
  // Every position the user could withdraw from.
  positions: PositionAddOption[]
  // The portfolio the withdrawal is drawn against.
  portfolioId: string
  // The position currently chosen.
  positionId: string
}

/**
 * @summary
 * Narrows the withdrawal position picker to the selected
 * portfolio.
 *
 * @remarks
 * A withdrawal can only target a position of the selected
 * portfolio, so the picker offers nothing else. With no
 * portfolio chosen the list stays empty, which the empty copy
 * explains instead of leaving the user guessing.
 *
 * The date field validates against the quota of a specific
 * fund, and only the selected position says which fund that
 * is. Resolving it here means the form reads `fundId` off one
 * call rather than reaching into the position list itself.
 *
 * @explanation
 * Use in `AddWithdrawalForm`. Call it once with the form's
 * `options.positions`, `portfolioId` and `positionId`, and
 * give the picker the `portfolioPositions` it returns while
 * passing `fundId` to the date field.
 *
 * @param options - The position list and the two selections.
 * @param options.positions - Every position on offer.
 * @param options.portfolioId - The portfolio chosen.
 * @param options.positionId - The position chosen.
 *
 * @returns The narrowed position list and the selected fund id.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useWithdrawalPositionScope({
  positions,
  portfolioId,
  positionId,
}: UseWithdrawalPositionScopeOptions) {
  const portfolioPositions = positions.filter(
    (position) => position.portfolioId === portfolioId
  )

  const fundId = portfolioPositions.find(
    (position) => position.id === positionId
  )?.fundId

  return { portfolioPositions, fundId }
}

export { useWithdrawalPositionScope }
