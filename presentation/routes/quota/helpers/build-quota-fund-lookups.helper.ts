import type { FundRow } from "@/presentation/types/fund-row.types"
import type { QuotaRow } from "@/presentation/types/quota-row.types"

import type { QuotaFundLookups } from "../types/quota-list.types"

// Empty lookups used before the loader resolves.
export const EMPTY_QUOTA_FUND_LOOKUPS: QuotaFundLookups = {
  quotas: {},
}

/**
 * @summary
 * Builds the fund lookups of the quota datatable.
 *
 * @remarks
 * Maps each quota id to its fund display data so the
 * datatable can resolve the fund column without joining
 * tables.
 *
 * @explanation
 * Use this helper in loaders that need the lookup
 * records consumed by the quota datatable columns.
 *
 * @param quotas - The imported quotas.
 * @param funds - The registered funds.
 *
 * @returns The fund lookups.
 *
 * @example
 * const LOOKUPS = BuildQuotaFundLookups(QUOTAS, FUNDS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildQuotaFundLookups(
  quotas: QuotaRow[],
  funds: FundRow[]
): QuotaFundLookups {
  const FUND_BY_ID = Object.fromEntries(
    funds.map((fund) => [fund.id, fund])
  )

  return {
    quotas: Object.fromEntries(
      quotas.map((quota) => [
        quota.id,
        {
          name: FUND_BY_ID[quota.fundId]?.name ?? "Fundo",
          cnpj: FUND_BY_ID[quota.fundId]?.cnpj ?? "",
        },
      ])
    ),
  }
}
