import { FundContainer } from "@/presentation/composition/fund.container"

import {
  BuildApplicationFundOptions,
  type ApplicationAddOptions,
} from "@/presentation/routes/application/types/application-add.types"

/**
 * @summary
 * Resolves the fund options of the add application flow.
 *
 * @remarks
 * Lists every registered fund and derives the display
 * options of the application combobox, ordered by name.
 * A fund already held by the portfolio stays in the list
 * so the user can apply to it again; funds that are not
 * held yet open a new position through the add
 * application use case.
 *
 * @explanation
 * Use this helper from the portfolio detail loader so
 * the registry listing stays in a single composition
 * point.
 *
 * @returns The application add options.
 *
 * @example
 * const OPTIONS = await LoadPortfolioApplicationOptions();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadPortfolioApplicationOptions(): Promise<ApplicationAddOptions> {
  const { list: LIST_FUNDS } = FundContainer()
  const FUNDS = await LIST_FUNDS.execute({})

  return { funds: BuildApplicationFundOptions(FUNDS) }
}
