import { FormatCnpjOptional } from "@/presentation/presenters/cnpj.presenter"
import type { FundRow } from "@/presentation/types/fund-row.types"
import type { QuotaRow } from "@/presentation/types/quota-row.types"

import type { QuotaFundLookups } from "../types/quota-list.types"

// Empty lookups used before the loader resolves.
export const EMPTY_QUOTA_FUND_LOOKUPS: QuotaFundLookups = {
  quotas: {},
  fundOptions: [],
}

/**
 * @summary
 * Builds the fund lookups of the quota datatable.
 *
 * @remarks
 * Maps each quota id to its fund display data so the
 * datatable can resolve the fund column without joining
 * tables, and derives the distinct funds the toolbar filter
 * offers. Each option carries the fund name as its label and
 * its formatted CNPJ as its description, so the combobox
 * shows the name above the CNPJ and can be searched by
 * either, matching the position filter.
 *
 * Options are ordered by label.
 *
 * @explanation
 * Use this helper in loaders that need the lookup
 * records consumed by the quota datatable columns and
 * filters.
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

  const SEEN_FUNDS = new Set<string>()

  const QUOTAS = Object.fromEntries(
    quotas.map((quota) => {
      SEEN_FUNDS.add(quota.fundId)

      return [
        quota.id,
        {
          fundId: quota.fundId,
          name: FUND_BY_ID[quota.fundId]?.name ?? "Fundo",
          cnpj: FUND_BY_ID[quota.fundId]?.cnpj ?? "",
        },
      ]
    })
  )

  const FUND_OPTIONS = [...SEEN_FUNDS]
    .map((fundId) => ({
      value: fundId,
      label: FUND_BY_ID[fundId]?.name ?? "Fundo",
      description: FormatCnpjOptional(FUND_BY_ID[fundId]?.cnpj),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))

  return {
    quotas: QUOTAS,
    fundOptions: FUND_OPTIONS,
  }
}
