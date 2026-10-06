import {
  BuildQuotaFundLookups,
  EMPTY_QUOTA_FUND_LOOKUPS,
} from "../helpers/build-quota-fund-lookups.helper"
import { LoadQuotas } from "../helpers/load-quotas.helper"
import type { QuotaListProps } from "../pages/list"

/**
 * @summary
 * Resolves the props for the quota list page.
 *
 * @remarks
 * Loads the session quotas and their fund lookups.
 *
 * @returns The quota list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadQuotaPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadQuotaPageProps(): Promise<QuotaListProps> {
  const LOADED = await LoadQuotas()

  if (LOADED) {
    const QUOTAS = LOADED.quotas
    const FUNDS = LOADED.funds
    const LOOKUPS = BuildQuotaFundLookups(QUOTAS, FUNDS)

    return { data: QUOTAS, lookups: LOOKUPS }
  }

  return { data: null, lookups: EMPTY_QUOTA_FUND_LOOKUPS }
}
