import { RequireSessionUser } from "@/lib/auth/require-session"
import { BankAccountContainer } from "@/presentation/composition/bank-account.container"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import { ToBankAccountRows } from "@/presentation/mappers/bank-account-row.mapper"
import { ToBankRows } from "@/presentation/mappers/bank-row.mapper"
import { ToCheckingAccountRows } from "@/presentation/mappers/checking-account-row.mapper"
import { ToPortfolioRows } from "@/presentation/mappers/portfolio-row.mapper"
import type { BankAccountRow } from "@/presentation/types/bank-account-row.types"
import type { BankRow } from "@/presentation/types/bank-row.types"
import type { CheckingAccountRow } from "@/presentation/types/checking-account-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

// Data resolved by the bank account list loader.
export interface LoadedBankAccountList {
  bankAccounts: BankAccountRow[]
  portfolios: PortfolioRow[]
  banks: BankRow[]
  entries: CheckingAccountRow[]
}

/**
 * @summary
 * Resolves the session user, the registered bank
 * accounts, and the portfolios, banks and checking
 * entries linked by the rows.
 *
 * @remarks
 * Derives the acting user from the session and lists, all
 * through the use cases of the bank account container, the
 * bank accounts plus the portfolios, banks and checking
 * account entries used by the list, the form selects and
 * the derived row summaries. Returns null when there is no
 * active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the registry listing stay in a single
 * composition point.
 *
 * @returns The loaded bank account list, or `null`.
 *
 * @example
 * const LOADED = await LoadBankAccounts();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadBankAccounts(): Promise<LoadedBankAccountList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const {
    list: LIST_BANK_ACCOUNTS,
    listBanks: LIST_BANKS,
    listCheckingAccounts: LIST_ENTRIES,
    listPortfolios: LIST_PORTFOLIOS,
  } = BankAccountContainer()

  const BANK_ACCOUNTS = await LIST_BANK_ACCOUNTS.execute({})
  const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
    userId: USER.id,
  })
  const BANKS = await LIST_BANKS.execute({})
  const ENTRIES = await LIST_ENTRIES.execute({})

  return {
    bankAccounts: ToBankAccountRows(BANK_ACCOUNTS),
    portfolios: ToPortfolioRows(PORTFOLIOS),
    banks: ToBankRows(BANKS),
    entries: ToCheckingAccountRows(ENTRIES),
  }
}
