import { LoadQuotas } from "../helpers/load-quotas.helper"
import { BuildQuotaFundLookups } from "../helpers/build-quota-fund-lookups.helper"
import type { QuotaListProps } from "../pages/list"
import type { QuotaRow } from "@/presentation/types/quota-row.types"
import type { QuotaFundLookups } from "../types/quota-list.types"
import type { FundRow } from "@/presentation/types/fund-row.types"
import { QuotaContainer } from "@/presentation/composition/quota.container"

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
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadQuotaPageProps(): Promise<QuotaListProps> {
  let data: QuotaRow[] | null = null
  let lookups: QuotaFundLookups = { quotas: {} }

  const LOADED = await LoadQuotas()

  if (LOADED) {
    const QUOTAS = LOADED.quotas
    const FUNDS = LOADED.funds
    const LOOKUPS = BuildQuotaFundLookups(QUOTAS, FUNDS)

    return { data: QUOTAS, lookups: LOOKUPS }
  }

  return { data: null, lookups: { quotas: {} } }
}