/**
 * @summary
 * Derived data rendered on a bank row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface BankRowSummary {
  // Bank accounts linked to the bank.
  accountCount: number
}

/**
 * @summary
 * Counts of one bank row, as resolved by the service.
 *
 * @remarks
 * The raw count carries the bank id, because it arrives
 * keyed by the database row rather than by the screen row.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface BankRowSummaryInput {
  bankId: string

  // Bank accounts linked to the bank.
  accountCount: number
}
