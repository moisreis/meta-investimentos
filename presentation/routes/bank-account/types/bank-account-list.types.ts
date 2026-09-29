import type { BankRow } from "@/presentation/types/bank-row.types"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

/**
 * @summary
 * Options consumed by the bank account forms.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface BankAccountSelectOptions {
  portfolios: PortfolioRow[]
  banks: BankRow[]
}

// Derived data rendered on a bank account row.
export interface BankAccountRowSummary {
  // Checking account entries linked to the bank account.
  checkingCount: number
}

// Name data resolved for a bank account row.
export interface BankAccountNameLookup {
  // Portfolio name displayed as the row title.
  portfolioName: string
  // Portfolio acronym displayed as the row subtitle.
  portfolioAcronym: string
  // Bank name displayed as the row title.
  bankName: string
}

// Name lookups used by the bank account datatable.
export interface BankAccountNameLookups {
  bankAccounts: Record<string, BankAccountNameLookup>
}
