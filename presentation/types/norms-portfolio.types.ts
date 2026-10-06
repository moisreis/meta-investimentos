/**
 * @summary
 * One norm a portfolio can be bound to.
 *
 * @remarks
 * The option is read from the norm registry and offered by the
 * norm picker of the portfolio forms. `articleNumber` is the
 * qualifier shown under the name, so two norms of the same
 * name stay distinguishable.
 *
 * The three bounds are the corridor the norm itself declares,
 * carried raw as dot decimals like every other norm read
 * model. They are not editable here: what a portfolio does
 * with a norm is the corridor it adopts, which lives on
 * `NormPortfolioAllocation`. The two are carried together so a
 * norm can be offered together with the limits it imposes.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
export interface NormOption {
  id: string
  name: string
  articleNumber: string
  // Floor the norm imposes on the allocation it governs.
  minAllocation: string
  // Allocation the norm asks for.
  targetAllocation: string
  // Ceiling the norm imposes on the allocation it governs.
  maxAllocation: string
}

/**
 * @summary
 * The allocation one norm carries inside one portfolio.
 *
 * @remarks
 * The three bounds are masked the way a percentage field shows
 * them, with a decimal comma, because the same row is edited by
 * `EntityPercentageInput` and read back by the summary under
 * the trigger. The bounds obey min <= target <= max, which is
 * re-checked by the form schema and again by the entity.
 *
 * The row carries two corridors, and the prefix is what tells
 * them apart. The unqualified bound belongs to the portfolio:
 * it is what this portfolio adopted for this norm, and it is
 * the one the form edits. The `norm`-prefixed bound belongs to
 * the norm: it is the limit the norm imposes on everyone, and
 * nothing on this screen can change it. They are stored
 * separately and can disagree — that disagreement is the
 * finding, which is why the norm bound is masked here too, so
 * the whole row reaches a reader in one shape.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
export interface NormPortfolioAllocation {
  normId: string
  normName: string
  articleNumber: string
  // Floor this portfolio adopted for this norm.
  minAllocation: string
  // Allocation this portfolio aims at.
  targetAllocation: string
  // Ceiling this portfolio adopted for this norm.
  maxAllocation: string
  // Floor the norm imposes, read-only.
  normMinAllocation: string
  // Allocation the norm asks for, read-only.
  normTargetAllocation: string
  // Ceiling the norm imposes, read-only.
  normMaxAllocation: string
}

/**
 * @summary
 * The allocation field a row edits.
 *
 * @remarks
 * The three bounds are the only editable part of a row, so the
 * row takes the field name rather than three more callbacks.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
export type NormAllocationField =
  "minAllocation" | "targetAllocation" | "maxAllocation"

/**
 * @summary
 * The norms a screen needs to offer and to seed.
 *
 * @remarks
 * `options` is the whole registry the picker filters, and
 * `allocations` is keyed by portfolio id so an edit form can be
 * seeded with the bounds already stored for its own portfolio
 * without asking the server again.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
export interface NormOptionRegistry {
  options: NormOption[]
  allocations: Record<string, NormPortfolioAllocation[]>
}
