import { Badge } from "@/presentation/ui/badge"

/**
 * Props for the entity state badge.
 */
export interface EntityStateBadgeProps {
  /**
   * Whether the row is in the matched state. The matched
   * state is the quiet one, since it is the expected one; the
   * unmatched state is the one worth drawing the eye to.
   */
  matched: boolean

  // Label of the matched state.
  matchedLabel: string

  // Label of the unmatched state.
  unmatchedLabel: string
}

/**
 * @summary
 * Renders a cell whose whole content is one comparison.
 *
 * @remarks
 * Several columns carry a single yes-or-no: a reversed or an
 * active transaction, an application or a withdrawal. The
 * comparison decides both the wording and the tone, so the two
 * can never drift apart: matched is the default badge,
 * unmatched is the destructive one, because the state that
 * deserves attention is the one that was not the expected
 * one.
 *
 * Naming the two states as matched and unmatched rather than
 * after their contents is what lets one badge serve a status
 * column and a kind column alike.
 *
 * @explanation
 * Use for a two-state cell where one comparison resolves both
 * the label and the emphasis. Pass the comparison and the two
 * labels, and the badge owns the tone.
 *
 * @param props - Props of the state badge.
 * @param props.matched - Whether the row is in the matched
 *   state.
 * @param props.matchedLabel - Label of the matched state.
 * @param props.unmatchedLabel - Label of the unmatched state.
 *
 * @returns The two-state badge.
 *
 * @example
 * <EntityStateBadge
 *   matched={value === null}
 *   matchedLabel={APPLICATION_DATATABLE.STATUS_ACTIVE_LABEL}
 *   unmatchedLabel={APPLICATION_DATATABLE.STATUS_REVERSED_LABEL}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function EntityStateBadge({
  matched,
  matchedLabel,
  unmatchedLabel,
}: EntityStateBadgeProps) {
  return (
    <Badge variant={matched ? "default" : "destructive"}>
      {matched ? matchedLabel : unmatchedLabel}
    </Badge>
  )
}

export { EntityStateBadge }
