"use client"

import { EntityChart } from "@/presentation/parts/charts/entity-chart"
import { EntityChartCard } from "@/presentation/parts/charts/entity-chart-card"
import type { PortfolioChartSection } from "../types/portfolio-chart-section.types"

/**
 * Props of the portfolio detail charts.
 */
export interface PortfolioDetailChartsProps {
  // The chart sections built by the overview hook, in render
  // order.
  sections: readonly PortfolioChartSection[]
}

/**
 * @summary
 * Renders the charts of the portfolio detail screen, grouped
 * into titled sections.
 *
 * @remarks
 * Every section renders its title and description above its
 * charts, so the screen reads in blocks instead of in a flat
 * list. The performance section features its first model —
 * the patrimony, which is the headline of the screen — at the
 * full width of the content area and lays the remaining ones
 * out in a responsive grid; the other sections lay every
 * chart out in that same grid. Every card is the shared chart
 * card and every plot is the shared chart, so the spacing and
 * the type scale match the KPI rows above.
 *
 * Renders nothing when no section has a model — before the
 * first snapshot and without holdings or balances — so the
 * screen falls back to its empty state without an orphan
 * frame.
 *
 * @param props - Props of the portfolio detail charts.
 * @param props.sections - The chart sections built by the
 *   overview hook.
 *
 * @returns The charts of the portfolio detail screen.
 *
 * @example
 * <PortfolioDetailCharts sections={SECTIONS} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function PortfolioDetailCharts({
  sections,
}: PortfolioDetailChartsProps) {
  if (sections.length === 0) return null

  return (
    <div className="flex w-full flex-col gap-0 ">
      {sections.map((section) => {
        const [FEATURED, ...REST] = section.models

        if (!FEATURED) return null

        return (
          <section
            key={section.id}
            className="flex w-full flex-col gap-4 p-4"
            aria-labelledby={`${section.id}-title`}
          >
            <div className="flex flex-col gap-1">
              <h2
                id={`${section.id}-title`}
                className="font-heading text-muted-foreground text-xs uppercase font-medium"
              >
                {section.title}
              </h2>
            </div>

            {section.featured ? (
              <div className="flex w-full flex-col gap-4">
                <EntityChartCard
                  title={FEATURED.title}
                  description={FEATURED.description}
                >
                  <EntityChart model={FEATURED} />
                </EntityChartCard>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                  {REST.map((model) => (
                    <EntityChartCard
                      key={model.id}
                      title={model.title}
                      description={model.description}
                    >
                      <EntityChart model={model} />
                    </EntityChartCard>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                {section.models.map((model) => (
                  <EntityChartCard
                    key={model.id}
                    title={model.title}
                    description={model.description}
                  >
                    <EntityChart model={model} />
                  </EntityChartCard>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

export { PortfolioDetailCharts }