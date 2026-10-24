/**
 * @summary
 * A movement of money in or out of a portfolio.
 *
 * @remarks
 * One row shape for both directions, so an application and
 * a redemption can be listed in a single table sorted by
 * date. The `kind` is what the row is read as, and it is
 * also what decides the badge color and the column order.
 *
 * Reversed movements remain listed with `reversedAt`
 * populated so the status column can mark them as
 * estornado. Non-reversed movements stay listed as active.
 *
 * @explanation
 * Use this type in the portfolio detail activity datatable.
 * `BuildPortfolioActivityRows` is the only producer, so no
 * view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
export interface PortfolioActivityRow {
  // Movement id, unique across both directions because an
  // application and a withdrawal never share a row.
  id: string
  // Direction of the movement.
  kind: PortfolioActivityKind
  // Position the movement went through.
  positionId: string
  // Fund of that position.
  fundId: string
  // Fund name, rendered as the title of the row.
  fundName: string
  // Bank that custodies the fund, rendered under the name.
  bankName: string
  // Movement date, as an ISO 8601 string. Compared by its
  // UTC day key, like every other date of the registry.
  date: string
  // Money moved, as a decimal string.
  amount: string
  // Quotas bought or sold, as a decimal string.
  quotas: string
  // ISO timestamp when reversed, or null when active.
  reversedAt: string | null
}

// Direction of a portfolio movement.
export type PortfolioActivityKind = "application" | "withdrawal"
