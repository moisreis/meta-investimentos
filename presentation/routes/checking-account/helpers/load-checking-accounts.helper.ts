import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { CheckingAccountRepository } from "@/infrastructure/checking-account/repositories/checking-account.repository"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import { ListBanksUseCase } from "@/services/bank/use-cases/list-banks.use-case"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"
import { ListBankAccountsUseCase } from "@/services/bank-account/use-cases/list-bank-accounts.use-case"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"
import { ListCheckingAccountsUseCase } from "@/services/checking-account/use-cases/list-checking-accounts.use-case"

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
 * Fetches the session from the request headers and
 * lists the balances plus the bank accounts and banks
 * used by the list and the form selects. Returns null
 * when there is no active session.
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
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  const CHECKING_ACCOUNT_REPOSITORY =
    new CheckingAccountRepository(db)
  const ENTRIES_USE_CASE = new ListCheckingAccountsUseCase(
    CHECKING_ACCOUNT_REPOSITORY
  )
  const ENTRIES = await ENTRIES_USE_CASE.execute({})

  const BANK_ACCOUNT_REPOSITORY = new BankAccountRepository(db)
  const BANK_ACCOUNTS_USE_CASE = new ListBankAccountsUseCase(
    BANK_ACCOUNT_REPOSITORY
  )
  const BANK_ACCOUNTS = await BANK_ACCOUNTS_USE_CASE.execute({})

  const BANK_REPOSITORY = new BankRepository(db)
  const BANKS_USE_CASE = new ListBanksUseCase(BANK_REPOSITORY)
  const BANKS = await BANKS_USE_CASE.execute({})

  return {
    entries: ENTRIES,
    bankAccounts: BANK_ACCOUNTS,
    banks: BANKS,
  }
}
