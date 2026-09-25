import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

import type { CheckingAccountNameLookups } from "../types/checking-account-list.types"

// Empty lookups used before the loader resolves.
export const EMPTY_CHECKING_ACCOUNT_NAME_LOOKUPS: CheckingAccountNameLookups =
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
 * Use to display or search the bank account secondary
 * text of the checking account table and forms.
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
 * Use to display the full account title of a checking
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
 * Resolves the display label of a bank account from the
 * name lookups.
 *
 * @remarks
 * Returns a fallback label when the lookup is missing.
 *
 * @param names - The checking account name lookups.
 * @param bankAccountId - The id of the bank account.
 *
 * @returns The resolved label.
 *
 * @example
 * const LABEL = ResolveBankAccountLabel(NAMES, ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function ResolveBankAccountLabel(
  names: CheckingAccountNameLookups,
  bankAccountId: string
): string {
  const LOOKUP = names.bankAccounts[bankAccountId]

  if (!LOOKUP) {
    return "Conta bancária"
  }

  return FormatBankAccountFullLabel(
    LOOKUP.bankName,
    LOOKUP.agency,
    LOOKUP.accountNumber
  )
}

/**
 * @summary
 * Builds the name lookups of the checking account
 * datatable.
 *
 * @remarks
 * Maps each bank account id to its display data so the
 * datatable can resolve the bank, agency, and account
 * columns without joining tables.
 *
 * @explanation
 * Use this helper in loaders that need the account
 * records consumed by the checking account datatable
 * columns.
 *
 * @param bankAccounts - The registered bank accounts.
 * @param banks - The registered banks.
 *
 * @returns The name lookups.
 *
 * @example
 * const NAMES = BuildCheckingAccountNameLookups(
 *   BANK_ACCOUNTS, BANKS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildCheckingAccountNameLookups(
  bankAccounts: BankAccountResponseDTO[],
  banks: BankResponseDTO[]
): CheckingAccountNameLookups {
  const BANK_NAMES = Object.fromEntries(
    banks.map((bank) => [bank.id, bank.name])
  )

  return {
    bankAccounts: Object.fromEntries(
      bankAccounts.map((account) => [
        account.id,
        {
          bankName: BANK_NAMES[account.bankId] ?? "Banco",
          agency: account.agency,
          accountNumber: account.accountNumber,
        },
      ])
    ),
  }
}
