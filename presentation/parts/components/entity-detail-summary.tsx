import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"
import type { JSX } from "react"

import { cn } from "cn"

import { Badge } from "@/presentation/ui/badge"
import { SharedUserAvatar } from "@/presentation/parts/components/shared-user-avatar"
import type { UserIdentity } from "@/presentation/types/user-identity.types"

/**
 * @summary
 * The direction money moved, driving the colour of a figure.
 *
 * @remarks
 * Only a figure that gained or lost money is coloured; money
 * that merely moved in or out stays ink. That single rule is
 * what keeps green and red meaning one thing on the screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export type EntitySummaryTone =
  "neutral" | "positive" | "negative"

/**
 * @summary
 * A single figure of the reconciliation under the headline.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export interface EntitySummaryEntry {
  // Stable id of the figure, used as the React key.
  key: string
  // Sentence case label naming what the figure is.
  label: string
  // The figure, already formatted and signed.
  value: string
  // The direction of the figure.
  tone: EntitySummaryTone
}

/**
 * @summary
 * The opening block of an entity detail screen.
 *
 * @remarks
 * Every figure arrives already formatted and signed by the
 * route builder, so the part renders text and decides only
 * where it sits and which tone paints it.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export interface EntitySummary {
  // Label of the headline figure, naming what it measures.
  label: string
  // The headline figure, the closing balance of the window.
  value: string
  // Optional qualifier rendered under the headline, such as
  // the registry document of the subject. Absent when the
  // subject has no second line to state.
  caption?: string | null
  // The return the window earned, split into the figure and
  // its qualifier so the figure can sit in a badge. Null
  // until the server resolves a return.
  note: EntitySummaryNote | null
  // The figures reconciling the opening balance with the
  // closing one, in reading order.
  entries: readonly EntitySummaryEntry[]
}

/**
 * @summary
 * The return earned by the window, next to the headline
 * figure.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export interface EntitySummaryNote {
  // The signed return, already formatted.
  value: string
  // Sentence case qualifier naming the horizon of the
  // return.
  label: string
  // The direction of the return.
  tone: EntitySummaryTone
}

/**
 * @summary
 * The opening block of a detail screen, and the person whose
 * subject it describes.
 *
 * @remarks
 * The owner is not part of the summary itself: a figure of
 * account is a fact about the subject, and the person behind
 * the subject is a fact about the page. Keeping them apart
 * lets a screen that has no single owner, a bank or a fund,
 * leave the byline out instead of inventing one.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export interface EntityDetailSummaryProps extends EntitySummary {
  // The user the subject belongs to, named beside the
  // headline label. Absent or `null` while the profile
  // cannot be resolved, so the block opens on the figure
  // alone rather than on an empty name.
  owner?: UserIdentity | null
}

// Text colour per tone. A neutral figure stays ink, so the
// only colour on the block is a gain or a loss.
const TONE_TEXT: Record<EntitySummaryTone, string> = {
  neutral: "text-foreground",
  positive: "text-positive",
  negative: "text-negative",
}

/**
 * @summary
 * Renders the opening block of an entity detail screen.
 *
 * @remarks
 * Opens the screen with one figure, the closing balance of
 * the selected window, set in the slab reserved for figures
 * of account at a size nothing else on the page competes
 * with. Its return sits under it as a signed figure inside a
 * badge and the horizon it covers beside it, both in muted
 * ink: the number carries the sign and the icon carries the
 * direction, so a coloured line is not what tells the reader
 * whether the money grew. A hairline row underneath
 * reconciles the opening balance with the closing one, so the
 * reader sees where the balance came from before scrolling to
 * any chart.
 *
 * The block is a ledger, not a set of cards: labels sit above
 * figures in a shared grid, the rules carry the structure, and
 * no figure is boxed on its own. The headline label is set at
 * the same size as the reconciliation labels, because it names
 * a figure like any other; the figure itself is what makes the
 * block the subject of the screen. Every figure is already
 * formatted and signed by the builder, so the direction of
 * money never depends on the colour alone.
 *
 * The owner, when the subject belongs to someone, is a byline
 * on the same line as the headline label, opposite it, so the
 * first line answers whose the figures are before the eye
 * reaches for what they are. The byline is set quieter than
 * the figure and carries no box of its own: a name is not
 * worth the attention a number is, and the avatar is small
 * enough to read as a signature rather than as a portrait.
 *
 * @explanation
 * Use this part as the first block of any detail screen
 * whose subject is a balance that moves over a period.
 *
 * @param props - Props of the detail summary.
 * @param props.label - Label of the headline figure.
 * @param props.value - The headline figure.
 * @param props.note - The return of the window, or `null`
 *   while it is unresolved.
 * @param props.entries - The reconciliation figures.
 * @param props.owner - The user the subject belongs to.
 *
 * @returns The detail summary.
 *
 * @example
 * <EntityDetailSummary {...SUMMARY} owner={OWNER} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export function EntityDetailSummary({
  label,
  value,
  caption,
  note,
  entries,
  owner,
}: EntityDetailSummaryProps): JSX.Element {
  return (
    <section className="flex flex-col gap-6 border-b border-border px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        {owner ? (
          <SharedUserAvatar
            firstName={owner.firstName}
            lastName={owner.lastName}
            image={owner.image}
            className="min-w-0 text-muted-foreground [&>span]:min-w-0 [&>span]:truncate"
          />
        ) : null}

        <h2 className="shrink-0 text-xs text-muted-foreground">
          {label}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-figure text-4xl leading-none tracking-tight text-foreground tabular-nums sm:text-6xl">
          {value}
        </p>

        {caption ? (
          <p className="text-sm text-muted-foreground tabular-nums">
            {caption}
          </p>
        ) : null}

        {note ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge
              variant="outline"
              className="h-5 gap-1 px-1.5 text-muted-foreground"
            >
              {note.tone === "negative" ? (
                <IconTrendingDown />
              ) : (
                <IconTrendingUp />
              )}

              <span className="tabular-nums">{note.value}</span>
            </Badge>

            {note.label}
          </p>
        ) : null}
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-5 sm:grid-cols-4">
        {entries.map((entry) => (
          <div key={entry.key} className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">
              {entry.label}
            </dt>
            <dd
              className={cn(
                "text-base font-medium tabular-nums",
                TONE_TEXT[entry.tone]
              )}
            >
              {entry.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
