import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"

import {
  BuildPositionAddOptions,
  type WithdrawalAddOptions,
} from "@/presentation/routes/withdrawal/types/withdrawal-add.types"

/**
 * @summary
 * Resolves the position options of the add withdrawal
 * flow.
 *
 * @remarks
 * Lists the positions of the portfolio and every
 * registered fund, then derives the display options of
 * the position combobox. The fund name is resolved
 * through the fund list and the share held by the
 * position is rendered under it.
 *
 * @explanation
 * Use this helper from the portfolio detail loader so
 * the position registry listing stays in a single
 * composition point. A withdrawal always targets an
 * existing position, so an empty portfolio yields no
 * options.
 *
 * @param portfolioId - The portfolio whose positions are
 * offered.
 *
 * @returns The withdrawal add options.
 *
 * @example
 * const OPTIONS =
 *   await LoadPortfolioWithdrawalOptions("portfolio-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPortfolioWithdrawalOptions(
  portfolioId: string
): Promise<WithdrawalAddOptions> {
  const {
    listAllPositions: LIST_POSITIONS,
    listFunds: LIST_FUNDS,
  } = WithdrawalContainer()

  const [POSITIONS, FUNDS] = await Promise.all([
    LIST_POSITIONS.execute({ portfolioIds: [portfolioId] }),
    LIST_FUNDS.execute({}),
  ])

  return {
    positions: BuildPositionAddOptions({
      positions: POSITIONS,
      funds: FUNDS,
    }),
  }
}
