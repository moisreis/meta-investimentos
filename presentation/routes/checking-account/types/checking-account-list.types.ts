import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

// Options consumed by the checking account forms.
export interface CheckingAccountSelectOptions {
  bankAccounts: BankAccountResponseDTO[]
  banks: BankResponseDTO[]
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
