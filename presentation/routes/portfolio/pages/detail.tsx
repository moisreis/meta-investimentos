"use client"

import { IconChartLine } from "@tabler/icons-react"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityDetailSummary } from "@/presentation/parts/components/entity-detail-summary"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"

import { PortfolioActivityDatatable } from "../activity/portfolio-activity-datatable"
import { PortfolioDetailCharts } from "../charts/portfolio-detail-charts"
import { PortfolioPositionsDatatable } from "../positions/portfolio-positions-datatable"
import { usePortfolioOverview } from "../hooks/use-portfolio-overview.hook"
import { PORTFOLIO_SUMMARY } from "../settings/labels.settings"
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
 * Opens with the extrato summary — the closing balance of the
 * selected window, the return it earned and the figures that
 * reconcile the opening balance with the closing one — then
 * continues as a document: the windowed performance, the
 * distributions and the checking accounts, the annual monthly
 * history, the positions the portfolio holds and the
 * movements of the window.
 *
 * The filter in the toolbar selects the window the summary,
 * the performance charts and the movements are computed
 * from; the values, the chart sections and the rows come from
 * the overview hook and never from component-local logic. The
 * distributions, the checking balances, the positions and the
 * annual monthly history are the exception by design: a
 * holding and a balance are facts about the portfolio today,
 * and the year is a fixed horizon, so they ignore the window.
 *
 * Without a single snapshot the summary gives way to the
 * shared empty state. The rest of the screen still renders,
 * because holdings and movements describe what the portfolio
 * has, not only what was snapshotted.
 *
 * The toolbar actions host the entry points of the add
 * application and add withdrawal flows. Each button owns its
 * own dialog, toast and add-another prompt, so the screen only
 * supplies the options loaded for this portfolio.
 *
 * @param props - Props of the portfolio detail screen.
 * @param props.data - The overview data, or `null` when the
 *                     portfolio cannot be resolved.
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

  const overview = usePortfolioOverview(DATA)
  const SUMMARY = overview.summary

  return (
    <div className="min-h-full overflow-auto">
      <div className="sticky top-0 z-50 h-11 w-full bg-background">
        <EntityDatatableToolbar
          filters={
            <EntityDateRangeFilter
              value={overview.dateRange}
              onChange={overview.onDateRangeChange}
              isDateDisabled={(date) =>
                !overview.isPerformanceDay(date)
              }
              placeholder={
                PORTFOLIO_SUMMARY.FILTER_DATE_PLACEHOLDER
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

      {SUMMARY ? (
        <EntityDetailSummary {...SUMMARY} />
      ) : (
        <EntityEmptyTable
          icon={IconChartLine}
          title={PORTFOLIO_SUMMARY.EMPTY_TITLE}
          description={PORTFOLIO_SUMMARY.EMPTY_DESCRIPTION}
        />
      )}

      <PortfolioDetailCharts sections={overview.chartSections} />

      <PortfolioPositionsDatatable holdings={DATA.holdings} />

      <PortfolioActivityDatatable rows={overview.activityRows} />
    </div>
  )
}

export { PortfolioDetail }
