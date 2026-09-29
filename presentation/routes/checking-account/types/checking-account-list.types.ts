import type { BankRow } from "@/presentation/types/bank-row.types"
import type { BankAccountRow } from "@/presentation/types/bank-account-row.types"

/**
 * @summary
 * Options consumed by the checking account forms.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface CheckingAccountSelectOptions {
  bankAccounts: BankAccountRow[]
  banks: BankRow[]
}

// Account data rendered on a checking account row.
export interface CheckingAccountNameLookup {
  // Bank name displayed as the row title.
  bankName: string
  // Bank agency displayed under the row title.
  agency: string
  // Bank account number displayed under the row title.
  accountNumber: string
}

// Name lookups used by the checking account datatable.
export interface CheckingAccountNameLookups {
  bankAccounts: Record<string, CheckingAccountNameLookup>
}
