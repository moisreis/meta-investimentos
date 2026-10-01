"use client"

import {
  Progress,
  ProgressValue,
} from "@/presentation/ui/progress"

// Separates the figures of one line of counts. A glyph
// rather than a word, because the figures read as one line
// rather than as two statements.
const SEPARATOR = "·"

// Percent suffix, since the bar reports a proportion and the
// number alone would not say which.
const PERCENT_SIGN = "%"

interface EntityJobProgressBarProps {
  // Read by the screen reader in place of the visible figures,
  // which it cannot read back as a proportion.
  label: string

  // Units the job has finished, skipped units included.
  done: number

  // Units the job has to finish.
  total: number
}

/**
 * @summary
 * Renders the bar a long-running job reports through.
 *
 * @remarks
 * Every polled job in the app shows the same three figures:
 * how far it has got, how far it has to go, and how much of
 * the total that is. Writing them once means the wording, the
 * order and the rounding are the same whether the job is
 * importing quotas or calculating a performance.
 *
 * The proportion is rounded rather than truncated, because a
 * bar that reads 0% at 49 out of 100 reads as stalled. The bar
 * still fills at the rounded figure, so the two never disagree.
 *
 * The accessible name is a prop because it names the job, not
 * the bar: the figures themselves are announced by the value,
 * so the label only has to say what is being counted.
 *
 * @explanation
 * Use inside the running branch of a job progress dialog. Pass
 * the units already processed and the units expected.
 *
 * @param props - Props of the progress bar.
 * @param props.label - Accessible name of the bar.
 * @param props.done - Units finished.
 * @param props.total - Units expected.
 *
 * @returns The progress bar.
 *
 * @example
 * <EntityJobProgressBar
 *   label={QUOTA_IMPORT.PROGRESS_LABEL}
 *   done={job.monthsDone}
 *   total={job.monthsTotal}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EntityJobProgressBar({
  label,
  done,
  total,
}: EntityJobProgressBarProps) {
  const PERCENT =
    total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Progress value={PERCENT} aria-label={label}>
      <ProgressValue>
        {(_formattedValue, value) =>
          `${done}/${total} ${SEPARATOR} ${
            value ?? 0
          }${PERCENT_SIGN}`
        }
      </ProgressValue>
    </Progress>
  )
}

export { EntityJobProgressBar }
