import { PRESENTER_FALLBACK } from "@/presentation/constants/presenter.constants"

/**
 * @summary
 * Renders the fallback a table cell shows instead of a value.
 *
 * @remarks
 * A nil, blank or zero value in a relation column is not an
 * error and not an empty frame: it reads as a quiet dash in the
 * muted colour, so the eye reads "nothing here" and moves on.
 * Owning it here is what keeps every datatable's absent value
 * looking the same instead of each route picking its own.
 *
 * @explanation
 * Use as the cell body whenever a row has no value for a
 * column, rather than rendering an empty cell or a literal
 * dash in a route file.
 *
 * @returns The muted fallback cell body.
 *
 * @example
 * <EntityFallbackCell />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function EntityFallbackCell() {
  return (
    <span className="text-muted-foreground">
      {PRESENTER_FALLBACK}
    </span>
  )
}

export { EntityFallbackCell }
