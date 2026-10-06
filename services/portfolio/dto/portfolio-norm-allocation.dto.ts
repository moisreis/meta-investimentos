/**
 * @summary
 * Defines the allocation one `Norm` carries inside a
 * `Portfolio`.
 *
 * @remarks
 * The bounds obey min <= target <= max and are decimal
 * strings. Only the norm id is stored: the name and the
 * article number are read from the norm registry, so a
 * portfolio never keeps a copy of them that can go stale.
 *
 * @explanation
 * Use this DTO for the norm list of a portfolio payload,
 * whether the portfolio is being created or updated.
 *
 * @example
 * const DTO: PortfolioNormAllocationDTO = {
 *   normId: "norm-1",
 *   minAllocation: "5",
 *   targetAllocation: "10",
 *   maxAllocation: "15",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
export interface PortfolioNormAllocationDTO {
  normId: string
  minAllocation: string
  targetAllocation: string
  maxAllocation: string
}
