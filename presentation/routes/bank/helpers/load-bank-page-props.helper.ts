import { LoadBanks } from "../helpers/load-banks.helper"
import { BuildBankRowSummaries } from "../helpers/build-bank-row-summaries.helper"
import type { BankListProps } from "../pages/list"

import { BankAccountContainer } from "@/presentation/composition/bank-account.container"

/**
 * @summary
 * Resolves the props for the bank list page.
 *
 * @remarks
 * Loads the session banks and the account count shown on
 * each row.
 *
 * @returns The bank list props, or empty props when there
 * is no active session.
 *
 * @example
 * const PROPS = await LoadBankPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadBankPageProps(): Promise<BankListProps> {
  const LOADED = await LoadBanks()

  if (LOADED) {
    const BANKS = LOADED
    const BANK_IDS = BANKS.map((bank) => bank.id)
    const { listBankRowSummaries: LIST_ROW_SUMMARIES } =
      BankAccountContainer()
    const ROW_SUMMARIES = await LIST_ROW_SUMMARIES.execute({
      bankIds: BANK_IDS,
    })

    return {
      data: BANKS,
      summaries: BuildBankRowSummaries(BANKS, ROW_SUMMARIES),
    }
  }

  return { data: null, summaries: null }
}
