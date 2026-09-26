"use client"

import { IconChartLine } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"

import { usePortfolioOverview } from "../hooks/use-portfolio-overview.hook"
import { PORTFOLIO_OVERVIEW } from "../settings/labels.settings"
import {
  EMPTY_PORTFOLIO_OVERVIEW,
  type PortfolioOverviewData,
} from "../types/portfolio-overview.types"
import { EntityDatatableAddItemButton } from "@/presentation/parts/components/entity-datatable-add-item-button"
import { ChartBarDefault } from "../charts/bar-chart"

interface PortfolioPageProps {
  data: PortfolioOverviewData | null
}

/**
 * @summary
 * Renders the portfolio detail screen.
 *
 * @remarks
 * Composes the toolbar with the date range filter, the
 * data-driven KPI groups and the empty state. The filter
 * selects the window the KPIs are computed from; KPI
 * values, trends and comparisons come from the overview
 * hook and never from component-local logic.
 *
 * @param props - Props of the portfolio detail screen.
 * @param props.data - The overview data, or `null` when
 *                     the portfolio cannot be resolved.
 *
 * @returns The portfolio detail screen.
 *
 * @example
 * <PortfolioPage data={DATA} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioPage({ data }: PortfolioPageProps) {
  const DATA = data ?? EMPTY_PORTFOLIO_OVERVIEW
  const HAS_PERFORMANCES = DATA.performances.length > 0

  const overview = usePortfolioOverview(DATA)
  const FIRST_KPI_GROUP = overview.kpis.slice(0, 3)
  const SECOND_KPI_GROUP = overview.kpis.slice(3)

  return (
    <>
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
            <EntityDatatableAddItemButton />
        }
      />

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

<div className="flex flex-col gap-2 p-4">
<h2>Histórico de performance</h2>

          <div className="grid grid-cols-2 gap-4">
            <ChartBarDefault />
            <ChartBarDefault />
          </div>
          </div>
        </>
      ) : (
        <EntityEmptyTable
          icon={IconChartLine}
          title={PORTFOLIO_OVERVIEW.EMPTY_TITLE}
          description={PORTFOLIO_OVERVIEW.EMPTY_DESCRIPTION}
        />
      )}
    </>
  )
}

export default PortfolioPage
