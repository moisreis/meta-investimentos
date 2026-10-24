import type { ReactNode } from "react"

import { Badge } from "@/presentation/ui/badge"
import type { badgeVariants } from "@/presentation/ui/badge"
import type { VariantProps } from "class-variance-authority"

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

  // Icon rendered before the matched label.
  matchedIcon?: ReactNode

  // Icon rendered before the unmatched label.
  unmatchedIcon?: ReactNode

  // Optional badge variant for the matched state.
  matchedVariant?: VariantProps<typeof badgeVariants>["variant"]

  // Optional badge variant for the unmatched state.
  unmatchedVariant?: VariantProps<
    typeof badgeVariants
  >["variant"]
}

/**
 * @summary
 * Renders a cell whose whole content is one comparison.
 *
 * @remarks
 * Several columns carry a single yes-or-no: a reversed or an
 * active transaction, an application or a withdrawal. The
 * comparison decides both the wording and the tone, so the two
 * can never drift apart: by default matched is rendered with
 * `outline` and unmatched with `outline`, but callers may
 * pass per-state variants to color distinct kinds without
 * changing existing usages.
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
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
function EntityStateBadge({
  matched,
  matchedLabel,
  unmatchedLabel,
  matchedIcon,
  unmatchedIcon,
  matchedVariant = "outline",
  unmatchedVariant = "outline",
}: EntityStateBadgeProps) {
  return (
    <Badge variant={matched ? matchedVariant : unmatchedVariant}>
      {matched ? matchedIcon : unmatchedIcon}
      {matched ? matchedLabel : unmatchedLabel}
    </Badge>
  )
}

export { EntityStateBadge }
