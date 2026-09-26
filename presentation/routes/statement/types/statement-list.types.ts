// Display data of the user who generated a statement.
export interface StatementGeneratedBy {
  // First name of the generating user.
  firstName: string

  // Last name of the generating user.
  lastName: string

  // Avatar image URL when one is registered.
  image: string | null
}

// Derived data rendered on a statement row.
export interface StatementRowSummary {
  // Acronym of the statement portfolio.
  portfolioAcronym: string

  // Name of the statement portfolio.
  portfolioName: string

  // Display data of the generating user.
  generatedBy: StatementGeneratedBy | null
}
