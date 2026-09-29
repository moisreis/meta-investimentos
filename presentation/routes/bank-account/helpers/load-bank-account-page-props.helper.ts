import { LoadBankAccounts } from "../helpers/load-bank-accounts.helper"
import { BuildBankAccountRowSummaries } from "../helpers/build-bank-account-row-summaries.helper"
import { BuildBankAccountNameLookups } from "../helpers/build-bank-account-name-lookups.helper"
import type { BankAccountListProps } from "../pages/list"
import type { BankAccountRow } from "@/presentation/types/bank-account-row.types"
import type { BankAccountRowSummary } from "../types/bank-account-list.types"
import type { BankAccountNameLookups } from "../types/bank-account-list.types"
import type { BankAccountSelectOptions } from "../types/bank-account-list.types"
import type { BankRow } from "@/presentation/types/bank-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import { BankAccountContainer } from "@/presentation/composition/bank-account.container"

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
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadBankAccountPageProps(): Promise<BankAccountListProps> {
  let data: BankAccountRow[] | null = null
  let options: BankAccountSelectOptions | null = null
  let summaries: Record<string, BankAccountRowSummary> | null = null
  let names: BankAccountNameLookups = { bankAccounts: {} }

  const LOADED = await LoadBankAccounts()

  if (LOADED) {
    const ACCOUNTS = LOADED.bankAccounts
    const OPTIONS = { portfolios: LOADED.portfolios, banks: LOADED.banks }
    const SUMMARIES = BuildBankAccountRowSummaries(ACCOUNTS, LOADED.entries)
    const NAMES = BuildBankAccountNameLookups(ACCOUNTS, LOADED.banks, LOADED.portfolios)

    return { data: ACCOUNTS, options: OPTIONS, names: NAMES, summaries: SUMMARIES }
  }

  return { data: null, options: null, summaries: null, names: { bankAccounts: {} } }
}