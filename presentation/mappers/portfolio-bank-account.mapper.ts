import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { PortfolioBankAccountView } from "@/presentation/types/portfolio-checking.types"

/**
 * @summary
 * Resolves the bank accounts of a portfolio from the registry
 * rows.
 *
 * @remarks
 * Selects the accounts of the portfolio and joins them with
 * the bank registry, so every view carries the institution
 * name and code next to the agency and the account number. An
 * account whose bank is missing from its registry is dropped,
 * since a balance cannot be labeled without the institution
 * behind it.
 *
 * The registry is loaded in full, because the accounts and
 * the banks may resolve in any order and the account count of
 * a portfolio is small next to the registry size — the same
 * trade-off as the holdings mapper.
 *
 * @explanation
 * Use this mapper in the portfolio detail loader. Resolving
 * the names here is what keeps the checking chart builders
 * pure, so they group and format but never look a name up.
 *
 * @param bankAccounts - The bank account registry, in any
 *   order.
 * @param banks - The bank registry, in any order.
 * @param portfolioId - The portfolio whose accounts are
 *   selected.
 *
 * @returns The resolved bank accounts, in registry order.
 *
 * @example
 * const ACCOUNTS = BuildPortfolioBankAccountViews(
 *   BANK_ACCOUNTS, BANKS, PORTFOLIO_ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPortfolioBankAccountViews(
  bankAccounts: readonly BankAccountResponseDTO[],
  banks: readonly BankResponseDTO[],
  portfolioId: string
): PortfolioBankAccountView[] {
  const BANKS = new Map(banks.map((bank) => [bank.id, bank]))

  return bankAccounts.flatMap((account) => {
    if (account.portfolioId !== portfolioId) return []

    const BANK = BANKS.get(account.bankId)
    if (!BANK) return []

    return [
      {
        id: account.id,
        bankId: BANK.id,
        bankName: BANK.name,
        bankCode: BANK.code,
        agency: account.agency,
        accountNumber: account.accountNumber,
      },
    ]
  })
}