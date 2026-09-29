import { RequireSessionUser } from "@/lib/auth/require-session"
import { FundContainer } from "@/presentation/composition/fund.container"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import {
  BuildApplicationFundOptions,
  BuildApplicationPortfolioOptions,
  type ApplicationAddOptions,
  EMPTY_APPLICATION_ADD_OPTIONS,
} from "@/presentation/routes/application/types/application-add.types"

/**
 * @summary
 * Resolves the options of the add application flow.
 *
 * @remarks
 * Lists every registered fund and the portfolios of the
 * session user, and derives the display options of the
 * application dialog, ordered by name. The portfolio detail
 * screen preselects its own portfolio, but the list stays
 * complete so the user can send the contribution to another
 * portfolio.
 *
 * A fund already held by the portfolio stays in the list so
 * the user can apply to it again; funds that are not held
 * yet open a new position through the add application use
 * case.
 *
 * @explanation
 * Use this helper from the portfolio detail loader so
 * the registry listing stays in a single composition
 * point.
 *
 * @returns The application add options, or the empty
 * options when there is no active session.
 *
 * @example
 * const OPTIONS = await LoadPortfolioApplicationOptions();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPortfolioApplicationOptions(): Promise<ApplicationAddOptions> {
  const USER = await RequireSessionUser()

  if (!USER) return EMPTY_APPLICATION_ADD_OPTIONS

  const { list: LIST_FUNDS } = FundContainer()
  const { list: LIST_PORTFOLIOS } = PortfolioContainer()

  const [FUNDS, PORTFOLIOS] = await Promise.all([
    LIST_FUNDS.execute({}),
    LIST_PORTFOLIOS.execute({ userId: USER.id }),
  ])

  return {
    funds: BuildApplicationFundOptions(FUNDS),
    portfolios: BuildApplicationPortfolioOptions(PORTFOLIOS),
  }
}
