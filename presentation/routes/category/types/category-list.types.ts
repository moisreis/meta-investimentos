/**
 * @summary
 * Derived data rendered on a category row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface CategoryRowSummary {
  // Funds linked to the category.
  fundCount: number
}

/**
 * @summary
 * Counts of one category row, as resolved by the service.
 *
 * @remarks
 * The raw count carries the category id, because it
 * arrives keyed by the database row rather than by the
 * screen row.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface CategoryRowSummaryInput {
  categoryId: string

  // Funds linked to the category.
  fundCount: number
}
