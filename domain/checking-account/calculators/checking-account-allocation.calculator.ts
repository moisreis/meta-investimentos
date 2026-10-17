import Decimal from "decimal.js"

export interface CheckingAccountBalanceEntry {
  // Institution the account is held at.
  institution: string
  // Digits of the account.
  accountNumber: string
  // Balance of the account, as a decimal string.
  balance: string
}

export interface CheckingAccountBalanceRow {
  institution: string
  accountNumber: string
  // Balance of the account, with two decimals.
  balance: string
  // Share of the total balance the account holds, in percent,
  // with two decimals.
  weight: string
}

/**
 * @summary
 * Allocates checking account balances into weighted rows.
 *
 * @remarks
 * Keeps one row per account and derives the share of the
 * total balance each account holds. Rows are sorted by
 * balance, largest first. When the total balance is zero,
 * every weight is `0.00`, so a month without a recorded
 * balance never divides by zero.
 *
 * @explanation
 * Use this calculator to resolve the checking account table
 * of the statement report before it renders. It only reads
 * the balances the caller provides, so the institution and
 * the account digits pass through untouched.
 *
 * @param entries - The account balances to allocate.
 *
 * @returns The allocation rows, largest balance first.
 *
 * @example
 * const ROWS = calculateCheckingAccountAllocation([
 *   {
 *     institution: "Banco A",
 *     accountNumber: "1234",
 *     balance: "800.00",
 *   },
 *   {
 *     institution: "Banco B",
 *     accountNumber: "5678",
 *     balance: "200.00",
 *   },
 * ]);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export function calculateCheckingAccountAllocation(
  entries: readonly CheckingAccountBalanceEntry[]
): CheckingAccountBalanceRow[] {
  const TOTAL = entries.reduce(
    (sum, entry) => sum.plus(new Decimal(entry.balance)),
    new Decimal(0)
  )

  return entries
    .map((ENTRY) => ({
      institution: ENTRY.institution,
      accountNumber: ENTRY.accountNumber,
      balance: new Decimal(ENTRY.balance).toFixed(2),
      weight: TOTAL.isZero()
        ? "0.00"
        : new Decimal(ENTRY.balance)
            .dividedBy(TOTAL)
            .times(100)
            .toFixed(2),
    }))
    .sort((left, right) =>
      new Decimal(right.balance).cmp(new Decimal(left.balance))
    )
}
