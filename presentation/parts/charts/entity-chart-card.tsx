import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card"

/**
 * Props of an entity chart card.
 */
export interface EntityChartCardProps {
  // Chart drawn in the body of the card.
  children: ReactNode
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
 * Composes the shared card with a bordered header holding
 * the title and the optional description, and a padded body
 * for the chart. Holds no chart logic: the route decides
 * what is plotted and the chart parts decide how, so the
 * spacing, the type scale and the border stay identical on
 * every detail screen.
 *
 * @explanation
 * Use as the frame of every chart of an entity detail
 * screen. Pass the chart as the child and keep the title and
 * the description in the route label settings, so the copy
 * stays reviewable next to the other entity copy.
 *
 * @param props - Props of the chart card.
 * @param props.children - The chart drawn in the card.
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
  description,
  title,
}: EntityChartCardProps) {
  return (
    <Card size="sm" className="gap-0 p-0">
      <CardHeader className="p-3">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="p-3 border-t bg-sidebar h-full">{children}</CardContent>
    </Card>
  )
}

export { EntityChartCard }
