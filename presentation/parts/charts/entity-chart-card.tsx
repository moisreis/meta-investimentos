import type { ReactNode } from "react"

import { cn } from "cn"

/**
 * Props of an entity chart card.
 */
export interface EntityChartCardProps {
  // Chart drawn in the body of the card.
  children: ReactNode
  // Extra classes, used by a section to span the featured
  // chart across its grid.
  className?: string
  // Optional explanatory line under the title.
  description?: string
  // Card title.
  title: string
}

/**
 * @summary
 * Renders the card shell every entity chart sits in.
 *
 * @remarks
 * Holds one frame, not two: a bordered surface with the
 * title, the optional description and the plot inside it, and
 * nothing else. The title is set in sentence case at reading
 * size, because it names a chart rather than announcing a
 * section, and the description under it states what the plot
 * measures — the axis of a financial series is never obvious
 * from the shape of the line alone.
 *
 * The card never sets a height of its own: the plot brings
 * its own, so a pie and an area chart rise to the same
 * height and the grid rows stay aligned. The header keeps a
 * minimum height of two description lines, so a card whose
 * description wraps does not push its plot below the plots
 * beside it.
 *
 * @explanation
 * Use as the frame of every chart of an entity detail
 * screen. Pass the chart as the child and keep the title and
 * the description in the route label settings, so the copy
 * stays reviewable next to the other entity copy.
 *
 * @param props - Props of the chart card.
 * @param props.children - The chart drawn in the card.
 * @param props.className - Extra classes merged into the
 *   frame, used by a section to span the featured chart.
 * @param props.description - Explanatory line under the
 *   title. Dropped when absent, instead of leaving a gap.
 * @param props.title - The card title.
 *
 * @returns The chart card.
 *
 * @example
 * <EntityChartCard title="Patrimônio">
 *   <EntityChart model={MODEL} />
 * </EntityChartCard>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function EntityChartCard({
  children,
  className,
  description,
  title,
}: EntityChartCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-md border border-border bg-background p-4",
        className
      )}
    >
      <div className="flex min-h-14 flex-col gap-1">
        <h3 className="text-sm font-medium text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  )
}

export { EntityChartCard }
