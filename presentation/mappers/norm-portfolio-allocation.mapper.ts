import {
  MaskPercentage,
  UnmaskPercentage,
} from "@/presentation/masks/percentage.mask"
import type {
  NormOption,
  NormPortfolioAllocation,
} from "@/presentation/types/norms-portfolio.types"
import type { NormPortfolioResponseDTO } from "@/services/norms-portfolio/dto/norm-portfolio-response.dto"
import type { PortfolioNormAllocationDTO } from "@/services/portfolio/dto/portfolio-norm-allocation.dto"

/**
 * @summary
 * Joins the norm-portfolio relations with the norm registry.
 *
 * @remarks
 * A relation stores the norm id and the corridor the portfolio
 * adopted, so the name, the article number and the corridor
 * the norm itself imposes come from the registry. A relation
 * whose norm is missing from the registry is dropped rather
 * than rendered with a blank name, because a row the user
 * cannot name is a row they cannot recognise.
 *
 * Both corridors come off the database as dot decimals, while
 * the field the user edits carries a comma, so both are masked
 * on the way out: seeding an edit form with the raw value would
 * show `10.5` next to `12,00` and store the untyped form back.
 * Masking the norm bounds too is what lets a reader take both
 * corridors off one row without checking which shape each is
 * in.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so forms and dialogs
 * never import a DTO.
 *
 * @param relations - The norm-portfolio relations.
 * @param options - The norm registry to name them from.
 *
 * @returns One masked allocation row per resolvable
 *          relation.
 *
 * @example
 * const ROWS = ToNormPortfolioAllocationRows(RELATIONS, OPTIONS);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
function ToNormPortfolioAllocationRows(
  relations: NormPortfolioResponseDTO[],
  options: NormOption[]
): NormPortfolioAllocation[] {
  const REGISTRY = new Map(
    options.map((option) => [option.id, option])
  )

  return relations.flatMap((relation) => {
    const NORM = REGISTRY.get(relation.normId)

    if (!NORM) return []

    return [
      {
        normId: NORM.id,
        normName: NORM.name,
        articleNumber: NORM.articleNumber,
        minAllocation: MaskPercentage(relation.minAllocation),
        targetAllocation: MaskPercentage(
          relation.targetAllocation
        ),
        maxAllocation: MaskPercentage(relation.maxAllocation),
        normMinAllocation: MaskPercentage(NORM.minAllocation),
        normTargetAllocation: MaskPercentage(
          NORM.targetAllocation
        ),
        normMaxAllocation: MaskPercentage(NORM.maxAllocation),
      },
    ]
  })
}

/**
 * @summary
 * Projects a form row onto the service allocation input.
 *
 * @remarks
 * The row also carries the name and the article number so
 * the summary under the trigger can be rendered, but the
 * service stores neither: both are read from the norm
 * registry, so a portfolio never keeps a copy that can go
 * stale. The three bounds are unmasked here, because a
 * masked comma would reach `SignedPercentage.create` as
 * NaN.
 *
 * @explanation
 * Use this mapper on submit, so the form and the action
 * agree on the payload and the masking lives in one place.
 *
 * @param row - The allocation row held by the form.
 *
 * @returns The service allocation input.
 *
 * @example
 * const INPUT = ToNormAllocationInput(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
function ToNormAllocationInput(
  row: PortfolioNormAllocationDTO
): PortfolioNormAllocationDTO {
  return {
    normId: row.normId,
    minAllocation: UnmaskPercentage(row.minAllocation),
    targetAllocation: UnmaskPercentage(row.targetAllocation),
    maxAllocation: UnmaskPercentage(row.maxAllocation),
  }
}

export { ToNormAllocationInput, ToNormPortfolioAllocationRows }
