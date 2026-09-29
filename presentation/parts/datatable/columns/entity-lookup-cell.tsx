import { cn } from "cn"

import { PRESENTER_FALLBACK } from "@/presentation/presenters/lookup.presenter"

/**
 * Props for the two-line entity lookup cell.
 */
export interface EntityLookupCellProps {
  // Primary text, rendered above the secondary line.
  title: string | null | undefined

  // Secondary text, rendered below the primary line. The
  // line is skipped when the value is nil or blank.
  subtitle?: string | null

  // Extra classes applied to the root element.
  className?: string
}

/**
 * @summary
 * Renders a related entity as a title above a subtitle.
 *
 * @remarks
 * The primary line carries the entity name at a medium
 * weight and the secondary line carries the qualifier, such
 * as a portfolio acronym or a masked CNPJ, in a smaller
 * muted weight. Both lines are truncated so wide values
 * never spill into the neighboring columns of a fluid
 * column. A nil or blank title renders the presenter
 * fallback instead of an empty cell.
 *
 * @explanation
 * Use this cell for the relation columns of a datatable,
 * such as a `Fundo` or `Carteira` column, so every route
 * resolves and formats its relations the same way.
 *
 * @param props - The lookup lines of the cell.
 * @param props.title - The entity name rendered on top.
 * @param props.subtitle - The qualifier rendered below.
 * @param props.className - Extra classes for the root.
 *
 * @returns The two-line lookup cell.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function EntityLookupCell({
  title,
  subtitle,
  className,
}: EntityLookupCellProps) {
  const TITLE = title?.trim() ?? ""
  const SUBTITLE = subtitle?.trim() ?? ""

  if (!TITLE) {
    return <span className="text-muted-foreground">{PRESENTER_FALLBACK}</span>
  }

  return (
    <div className={cn("min-w-0", className)}>
      <p className="truncate font-medium">{TITLE}</p>
      {SUBTITLE ? (
        <p className="truncate text-xs font-normal text-muted-foreground">
          {SUBTITLE}
        </p>
      ) : null}
    </div>
  )
}

export { EntityLookupCell }
