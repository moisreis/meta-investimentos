import type { JSX } from "react"

import { cn } from "cn"

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
  // The stated window, so the figures below always say which
  // period they belong to.
  period: string
  // Sentence case label of the headline figure.
  label: string
  // The headline figure, the closing balance of the window.
  value: string
  // The qualifier of the headline figure.
  note: string
  // The direction of the qualifier.
  noteTone: EntitySummaryTone
  // The figures reconciling the opening balance with the
  // closing one, in reading order.
  entries: readonly EntitySummaryEntry[]
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
 * with. Its return sits under it as the only coloured
 * element, and a hairline row underneath reconciles the
 * opening balance with the closing one, so the reader sees
 * where the balance came from before scrolling to any chart.
 *
 * The block is a ledger, not a set of cards: labels sit above
 * figures in a shared grid, the rules carry the structure, and
 * no figure is boxed on its own. Every figure is already
 * formatted and signed by the builder, so the direction of
 * money never depends on the colour alone.
 *
 * @explanation
 * Use this part as the first block of any detail screen
 * whose subject is a balance that moves over a period.
 *
 * @param props - Props of the detail summary.
 * @param props.period - The stated window.
 * @param props.label - Label of the headline figure.
 * @param props.value - The headline figure.
 * @param props.note - The qualifier of the headline figure.
 * @param props.noteTone - The direction of the qualifier.
 * @param props.entries - The reconciliation figures.
 *
 * @returns The detail summary.
 *
 * @example
 * <EntityDetailSummary {...SUMMARY} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export function EntityDetailSummary({
  period,
  label,
  value,
  note,
  noteTone,
  entries,
}: EntitySummary): JSX.Element {
  return (
    <section className="flex flex-col gap-6 border-b border-border px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 className="text-sm text-muted-foreground">
          {label}
        </h2>
        <p className="text-sm text-muted-foreground tabular-nums">
          {period}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <p className="font-figure text-4xl leading-none tracking-tight text-foreground tabular-nums sm:text-6xl">
          {value}
        </p>
        {note ? (
          <p
            className={cn(
              "text-sm tabular-nums",
              TONE_TEXT[noteTone]
            )}
          >
            {note}
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
