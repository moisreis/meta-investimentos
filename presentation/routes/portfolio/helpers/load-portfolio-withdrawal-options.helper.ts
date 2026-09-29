import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import { PositionContainer } from "@/presentation/composition/position.container"
import { WithdrawalContainer } from "@/presentation/composition/withdrawal.container"
import { ToPositionWeightRows } from "@/presentation/mappers/position-weight-row.mapper"

import {
  BuildPositionAddOptions,
  BuildWithdrawalPortfolioOptions,
  type WithdrawalAddOptions,
  EMPTY_WITHDRAWAL_ADD_OPTIONS,
} from "@/presentation/routes/withdrawal/types/withdrawal-add.types"

/**
 * @summary
 * Resolves the portfolio and position options of the add
 * withdrawal flow.
 *
 * @remarks
 * Lists the positions of the portfolio, every registered
 * fund, and the portfolios of the session user, then
 * derives the display options of the dialog. The fund
 * name is resolved through the fund list and the share
 * held by the position is rendered under it, derived from
 * the money invested in the position.
 *
 * The portfolio picker stays complete even though the
 * screen preselects its own portfolio, so the user can
 * redeem from another portfolio. Picking a different
 * portfolio narrows the position options to it.
 *
 * @explanation
 * Use this helper from the portfolio detail loader so
 * the position registry listing stays in a single
 * composition point. A withdrawal always targets an
 * existing position, so an empty portfolio yields no
 * position options.
 *
 * @param portfolioId - The portfolio whose positions are
 * offered.
 *
 * @returns The withdrawal add options, or the empty
 * options when there is no active session.
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
  const USER = await RequireSessionUser()

  if (!USER) return EMPTY_WITHDRAWAL_ADD_OPTIONS

  const {
    listAllPositions: LIST_POSITIONS,
    listFunds: LIST_FUNDS,
  } = WithdrawalContainer()
  const { list: LIST_PORTFOLIOS } = PortfolioContainer()
  const { listWeights: LIST_WEIGHTS } = PositionContainer()

  const [POSITIONS, FUNDS, PORTFOLIOS, WEIGHTS] = await Promise.all([
    LIST_POSITIONS.execute({ portfolioIds: [portfolioId] }),
    LIST_FUNDS.execute({}),
    LIST_PORTFOLIOS.execute({ userId: USER.id }),
    LIST_WEIGHTS.execute({ portfolioIds: [portfolioId] }),
  ])

  return {
    positions: BuildPositionAddOptions({
      positions: POSITIONS,
      funds: FUNDS,
      weights: ToPositionWeightRows(WEIGHTS),
    }),
    portfolios: BuildWithdrawalPortfolioOptions(PORTFOLIOS),
  }
}
