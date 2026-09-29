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
 * The screen reads as a document: every block — the summary,
 * a group of charts, a table — is introduced by one quiet
 * sentence case heading and separated from the next by a
 * hairline, and no block is boxed inside another.
 *
 * The performance section spans its first model — the
 * patrimony, the headline chart of the window — across the
 * full width of the content and lays the remaining ones out
 * beside each other; the other sections lay every chart out
 * in that same grid. Every card is the shared chart card and
 * every plot is the shared chart, so the spacing, the type
 * scale and the plot height match the block above them.
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
    <div className="flex w-full flex-col">
      {sections.map((section) => {
        const [FEATURED, ...REST] = section.models

        if (!FEATURED) return null

        return (
          <section
            key={section.id}
            className="flex w-full flex-col gap-4 border-b border-border px-4 py-6 last:border-b-0 sm:px-6"
            aria-labelledby={`${section.id}-title`}
          >
            <h2
              id={`${section.id}-title`}
              className="text-base font-medium text-foreground"
            >
              {section.title}
            </h2>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <EntityChartCard
                className={
                  section.featured ? "md:col-span-2" : undefined
                }
                title={FEATURED.title}
                description={FEATURED.description}
              >
                <EntityChart model={FEATURED} />
              </EntityChartCard>

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
          </section>
        )
      })}
    </div>
  )
}

export { PortfolioDetailCharts }
