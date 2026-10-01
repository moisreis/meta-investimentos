/**
 * @summary
 * Display name and avatar data of a portfolio owner.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface PortfolioOwner {
  // First name of the owning user.
  firstName: string

  // Last name of the owning user.
  lastName: string

  // Avatar image URL when one is registered.
  image: string | null
}

/**
 * @summary
 * Counts of one portfolio row, as resolved by the service.
 *
 * @remarks
 * The raw counts carry the portfolio id, because they
 * arrive keyed by the database row rather than by the
 * screen row.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface PortfolioRowSummaryInput {
  portfolioId: string

  // Distinct funds held by the portfolio.
  fundCount: number

  // Bank accounts linked to the portfolio.
  bankAccountCount: number
}

/**
 * @summary
 * Derived data rendered on a portfolio row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface PortfolioRowSummary {
  // Distinct funds held by the portfolio.
  fundCount: number

  // Bank accounts linked to the portfolio.
  bankAccountCount: number

  // Display data of the owning user.
  owner: PortfolioOwner | null
}
