"use client"

import { IconChartLine } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"

import { PortfolioActivityDatatable } from "../activity/portfolio-activity-datatable"
import { PortfolioDetailCharts } from "../charts/portfolio-detail-charts"
import { PortfolioPositionsDatatable } from "../positions/portfolio-positions-datatable"
import { usePortfolioOverview } from "../hooks/use-portfolio-overview.hook"
import { PORTFOLIO_OVERVIEW } from "../settings/labels.settings"
import {
  EMPTY_PORTFOLIO_OVERVIEW,
  type PortfolioOverviewData,
} from "../types/portfolio-overview.types"
import { AddApplicationButton } from "@/presentation/routes/application/components/add-application-button"
import { AddWithdrawalButton } from "@/presentation/routes/withdrawal/components/add-withdrawal-button"

interface PortfolioDetailProps {
  data: PortfolioOverviewData | null
}

/**
 * @summary
 * Renders the portfolio detail screen.
 *
 * @remarks
 * Composes the toolbar with the date range filter, the
 * data-driven KPI groups, the sectioned charts, the positions
 * datatable, the recent activity datatable and the empty
 * state. The filter selects the window the KPIs, the
 * performance charts and the activity rows are computed
 * from; KPI values, trends, comparisons, chart sections and
 * movements come from the overview hook and never from
 * component-local logic. The distributions, the checking
 * balances, the positions and the annual monthly history are
 * the exception by design: a holding and a balance are facts
 * about the portfolio today, and the year is a fixed
 * horizon, so they ignore the window.
 *
 * The KPI groups render only over a performance snapshot
 * window; without one the friendly empty state takes their
 * place. The chart sections, the positions and the activity
 * table render either way when they have data, because they
 * describe what the portfolio holds and has moved, not only
 * what was snapshotted.
 *
 * The toolbar actions host the entry points of the
 * add application and add withdrawal flows. Each button
 * owns its own dialog, toast and add-another prompt, so
 * the screen only supplies the options loaded for this
 * portfolio.
 *
 * @param props - Props of the portfolio detail screen.
 * @param props.data - The overview data, or `null` when
 *                     the portfolio cannot be resolved.
 *
 * @returns The portfolio detail screen.
 *
 * @example
 * <PortfolioDetail data={DATA} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioDetail({ data }: PortfolioDetailProps) {
  const DATA = data ?? EMPTY_PORTFOLIO_OVERVIEW
  const HAS_PERFORMANCES = DATA.performances.length > 0

  const overview = usePortfolioOverview(DATA)
  const FIRST_KPI_GROUP = overview.kpis.slice(0, 3)
  const SECOND_KPI_GROUP = overview.kpis.slice(3)

  return (
    <div className="min-h-full overflow-auto">
      <div className="w-full h-11 top-0 sticky bg-background z-50">
      <EntityDatatableToolbar
        filters={
          <EntityDateRangeFilter
            value={overview.dateRange}
            onChange={overview.onDateRangeChange}
            isDateDisabled={(date) =>
              !overview.isPerformanceDay(date)
            }
            placeholder={
              PORTFOLIO_OVERVIEW.FILTER_DATE_PLACEHOLDER
            }
            numberOfMonths={1}
          />
        }
        actions={
          <>
            <AddApplicationButton
              portfolioId={DATA.portfolioId}
              options={DATA.applicationOptions}
            />
            <AddWithdrawalButton
              portfolioId={DATA.portfolioId}
              options={DATA.withdrawalOptions}
            />
          </>
        }
      />
      </div>

      {HAS_PERFORMANCES ? (
        <>
          <EntityDatatableKpiGroup>
            {FIRST_KPI_GROUP.map((kpi) => (
              <EntityDatatableKpiCard
                key={kpi.key}
                title={kpi.title}
                value={kpi.value}
                trend={kpi.trend}
                comparison={kpi.comparison}
                dotIndicator={kpi.dotIndicator}
                icon={kpi.icon}
              />
            ))}
          </EntityDatatableKpiGroup>

          <EntityDatatableKpiGroup>
            {SECOND_KPI_GROUP.map((kpi) => (
              <EntityDatatableKpiCard
                key={kpi.key}
                title={kpi.title}
                value={kpi.value}
                trend={kpi.trend}
                comparison={kpi.comparison}
                dotIndicator={kpi.dotIndicator}
                icon={kpi.icon}
              />
            ))}
          </EntityDatatableKpiGroup>
        </>
      ) : (
        <EntityEmptyTable
          icon={IconChartLine}
          title={PORTFOLIO_OVERVIEW.EMPTY_TITLE}
          description={PORTFOLIO_OVERVIEW.EMPTY_DESCRIPTION}
        />
      )}

      <PortfolioDetailCharts sections={overview.chartSections} />
    </div>
  )
}

export { PortfolioDetail }
