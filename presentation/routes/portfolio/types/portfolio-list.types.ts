// Display name and avatar data of a portfolio owner.
export interface PortfolioOwner {
  // First name of the owning user.
  firstName: string

  // Last name of the owning user.
  lastName: string

  // Avatar image URL when one is registered.
  image: string | null
}

// Derived data rendered on a portfolio row.
export interface PortfolioRowSummary {
  // Distinct funds held by the portfolio.
  fundCount: number

  // Bank accounts linked to the portfolio.
  bankAccountCount: number

  // Display data of the owning user.
  owner: PortfolioOwner | null
}
