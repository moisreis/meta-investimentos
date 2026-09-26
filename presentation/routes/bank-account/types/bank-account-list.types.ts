import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

// Options consumed by the bank account forms.
export interface BankAccountSelectOptions {
  portfolios: PortfolioResponseDTO[]
  banks: BankResponseDTO[]
}

// Derived data rendered on a bank account row.
export interface BankAccountRowSummary {
  // Checking account entries linked to the bank account.
  checkingCount: number
}

// Name data resolved for a bank account row.
export interface BankAccountNameLookup {
  // Portfolio name displayed as the row subtitle.
  portfolioName: string
  // Bank name displayed as the row title.
  bankName: string
}

// Name lookups used by the bank account datatable.
export interface BankAccountNameLookups {
  bankAccounts: Record<string, BankAccountNameLookup>
}
