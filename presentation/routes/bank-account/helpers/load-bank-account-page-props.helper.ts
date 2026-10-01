import { LoadBankAccounts } from "../helpers/load-bank-accounts.helper"
import { BuildBankAccountRowSummaries } from "../helpers/build-bank-account-row-summaries.helper"
import { BuildBankAccountNameLookups } from "../helpers/build-bank-account-name-lookups.helper"
import type { BankAccountListProps } from "../pages/list"

/**
 * @summary
 * Resolves the props for the bank account list page.
 *
 * @remarks
 * Loads the session bank accounts and their display names.
 *
 * @returns The bank account list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadBankAccountPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadBankAccountPageProps(): Promise<BankAccountListProps> {
  const LOADED = await LoadBankAccounts()

  if (LOADED) {
    const ACCOUNTS = LOADED.bankAccounts
    const OPTIONS = {
      portfolios: LOADED.portfolios,
      banks: LOADED.banks,
    }
    const SUMMARIES = BuildBankAccountRowSummaries(
      ACCOUNTS,
      LOADED.entries
    )
    const NAMES = BuildBankAccountNameLookups(
      ACCOUNTS,
      LOADED.banks,
      LOADED.portfolios
    )

    return {
      data: ACCOUNTS,
      options: OPTIONS,
      names: NAMES,
      summaries: SUMMARIES,
    }
  }

  return {
    data: null,
    options: null,
    summaries: null,
    names: { bankAccounts: {} },
  }
}
