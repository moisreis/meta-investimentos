/**
 * @summary
 * Position offered by the add withdrawal form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface PositionAddOption {
  id: string
  // Fund name of the position, rendered as the primary
  // text.
  name: string
  // Owning portfolio, used to narrow the picker down to the
  // positions of the selected portfolio.
  portfolioId: string
  // Fund id for quota date validation.
  fundId: string
  // Share the position holds of its portfolio, rendered
  // under the fund name. Empty when the position holds
  // nothing of the portfolio.
  description: string
}

/**
 * @summary
 * Portfolio offered by the add withdrawal form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface WithdrawalPortfolioOption {
  id: string
  // Portfolio name rendered above the acronym.
  name: string
  // Portfolio acronym rendered under the name.
  description: string
}

// Options consumed by the add withdrawal form.
export interface WithdrawalAddOptions {
  positions: PositionAddOption[]
  portfolios: WithdrawalPortfolioOption[]
}

// Empty options used before the loader resolves.
export const EMPTY_WITHDRAWAL_ADD_OPTIONS: WithdrawalAddOptions =
  {
    positions: [],
    portfolios: [],
  }
