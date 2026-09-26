import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import type { BankAccountNameLookups } from "../types/bank-account-list.types"

// Empty lookups used before the loader resolves.
export const EMPTY_BANK_ACCOUNT_NAME_LOOKUPS: BankAccountNameLookups =
  {
    bankAccounts: {},
  }

/**
 * @summary
 * Formats a bank agency and account number as a label.
 *
 * @remarks
 * Renders the agency and account columns with the
 * `Ag.` and `Conta` prefixes.
 *
 * @explanation
 * Use to display or search the account number of the
 * bank account table and forms.
 *
 * @param agency - The bank agency.
 * @param accountNumber - The bank account number.
 *
 * @returns The formatted account label.
 *
 * @example
 * const LABEL = FormatBankAccountLabel("1234", "56789-0");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FormatBankAccountLabel(
  agency: string,
  accountNumber: string
): string {
  return `Ag. ${agency} · Conta ${accountNumber}`
}

/**
 * @summary
 * Formats the full account label with the bank name.
 *
 * @remarks
 * Joins the bank name with the account label rendered
 * by `FormatBankAccountLabel`.
 *
 * @explanation
 * Use to display the full account title of a bank
 * account row or delete description.
 *
 * @param bankName - The bank name.
 * @param agency - The bank agency.
 * @param accountNumber - The bank account number.
 *
 * @returns The formatted full label.
 *
 * @example
 * const LABEL = FormatBankAccountFullLabel(
 *   "Banco do Brasil", "1234", "56789-0");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FormatBankAccountFullLabel(
  bankName: string,
  agency: string,
  accountNumber: string
): string {
  return `${bankName} · ${FormatBankAccountLabel(agency, accountNumber)}`
}

/**
 * @summary
 * Builds the name lookups of the bank account
 * datatable.
 *
 * @remarks
 * Maps each bank account id to its display data so the
 * datatable can resolve the portfolio and bank columns
 * without joining tables.
 *
 * @explanation
 * Use this helper in loaders that need the lookup
 * records consumed by the bank account datatable
 * columns and the edit form.
 *
 * @param bankAccounts - The registered bank accounts.
 * @param banks - The registered banks.
 * @param portfolios - The registered portfolios.
 *
 * @returns The name lookups.
 *
 * @example
 * const NAMES = BuildBankAccountNameLookups(
 *   BANK_ACCOUNTS, BANKS, PORTFOLIOS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildBankAccountNameLookups(
  bankAccounts: BankAccountResponseDTO[],
  banks: BankResponseDTO[],
  portfolios: PortfolioResponseDTO[]
): BankAccountNameLookups {
  const BANK_NAMES = Object.fromEntries(
    banks.map((bank) => [bank.id, bank.name])
  )

  const PORTFOLIO_NAMES = Object.fromEntries(
    portfolios.map((portfolio) => [portfolio.id, portfolio.name])
  )

  return {
    bankAccounts: Object.fromEntries(
      bankAccounts.map((account) => [
        account.id,
        {
          portfolioName:
            PORTFOLIO_NAMES[account.portfolioId] ?? "Carteira",
          bankName: BANK_NAMES[account.bankId] ?? "Banco",
        },
      ])
    ),
  }
}
