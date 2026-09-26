import { RequireSessionUser } from "@/lib/auth/require-session"
import { CheckingAccountContainer } from "@/presentation/composition/checking-account.container"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

// Data resolved by the checking account list loader.
export interface LoadedCheckingAccountList {
  entries: CheckingAccountResponseDTO[]
  bankAccounts: BankAccountResponseDTO[]
  banks: BankResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, the registered checking
 * account balances, and the bank accounts and banks
 * linked by the rows.
 *
 * @remarks
 * Derives the acting user from the session and lists the
 * balances plus the bank accounts and banks used by the
 * list and the form selects, all through the checking
 * account container. Returns null when there is no active
 * session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the balance listing stay in a single
 * composition point.
 *
 * @returns The balance rows and the registry options,
 *          or `null`.
 *
 * @example
 * const LOADED = await LoadCheckingAccounts();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadCheckingAccounts(): Promise<LoadedCheckingAccountList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const {
    list: LIST_ENTRIES,
    listBankAccounts: LIST_BANK_ACCOUNTS,
    listBanks: LIST_BANKS,
  } = CheckingAccountContainer()

  const ENTRIES = await LIST_ENTRIES.execute({})
  const BANK_ACCOUNTS = await LIST_BANK_ACCOUNTS.execute({})
  const BANKS = await LIST_BANKS.execute({})

  return {
    entries: ENTRIES,
    bankAccounts: BANK_ACCOUNTS,
    banks: BANKS,
  }
}
