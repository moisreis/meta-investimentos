import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

import { EMPTY_WITHDRAWAL_LOOKUPS } from "../helpers/build-withdrawal-lookups.helper"
import { BuildWithdrawalLookups } from "../helpers/build-withdrawal-lookups.helper"
import { LoadWithdrawals } from "../helpers/load-withdrawals.helper"
import {
  BuildPositionAddOptions,
  BuildWithdrawalPortfolioOptions,
  type WithdrawalAddOptions,
  EMPTY_WITHDRAWAL_ADD_OPTIONS,
} from "../types/withdrawal-add.types"
import type { WithdrawalListProps } from "../pages/list"
import type { WithdrawalLookups } from "../types/withdrawal-list.types"

/**
 * @summary
 * Resolves the props for the withdrawal list page.
 *
 * @remarks
 * Loads the session withdrawals, their lookups and the
 * add flow options. The portfolio and position options are
 * derived from the portfolios, positions, weights and funds
 * the loader already read, so the add dialog can pick a
 * portfolio and a position without a second round trip.
 *
 * @returns The withdrawal list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadWithdrawalPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadWithdrawalPageProps(): Promise<WithdrawalListProps> {
  let data: WithdrawalRow[] | null = null
  let lookups: WithdrawalLookups = EMPTY_WITHDRAWAL_LOOKUPS
  let options: WithdrawalAddOptions = EMPTY_WITHDRAWAL_ADD_OPTIONS

  const LOADED = await LoadWithdrawals()

  if (LOADED) {
    data = LOADED.withdrawals
    lookups = BuildWithdrawalLookups(LOADED)
    options = {
      positions: BuildPositionAddOptions({
        positions: LOADED.positions,
        funds: LOADED.funds,
        weights: LOADED.weights,
      }),
      portfolios: BuildWithdrawalPortfolioOptions(LOADED.portfolios),
    }
  }

  return { data, lookups, options }
}
