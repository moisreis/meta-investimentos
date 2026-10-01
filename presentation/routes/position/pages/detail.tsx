"use client"

import { IconChartLine } from "@tabler/icons-react"

import { EntityChartSections } from "@/presentation/parts/charts/entity-chart-sections"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityDetailShell } from "@/presentation/parts/components/entity-detail-shell"
import { EntityDetailSummary } from "@/presentation/parts/components/entity-detail-summary"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import { EntityDateRangeFilter } from "@/presentation/parts/filters/entity-date-range"

import { PositionActivityDatatable } from "../components/position-activity-datatable"
import { usePositionOverview } from "../hooks/use-position-overview.hook"
import { POSITION_SUMMARY } from "../settings/labels.settings"
import {
  EMPTY_POSITION_OVERVIEW,
  type PositionOverviewData,
} from "../types/position-overview.types"

interface PositionDetailProps {
  data: PositionOverviewData | null
}

/**
 * @summary
 * Renders the position detail screen.
 *
 * @remarks
 * Opens with the extrato summary — the closing value of the
 * selected window, the return it earned and the figures that
 * reconcile the opening value with the closing one — then
 * continues as a document: the windowed performance, the
 * annual monthly history and the movements of the window.
 *
 * The filter in the toolbar selects the window the summary,
 * the performance charts and the movements are computed
 * from; the values, the chart sections and the rows come
 * from the overview hook and never from component-local
 * logic. The annual monthly history is the exception by
 * design: the year is a fixed horizon, so it ignores the
 * window.
 *
 * The page composes the blocks and owns no markup: the shell
 * pins the toolbar, the summary is the shared detail block
 * and the charts and the movements are the parts that render
 * them.
 *
 * Without a single snapshot the summary gives way to the
 * shared empty state. The rest of the screen still renders,
 * because movements describe what the position did, not only
 * what was snapshotted.
 *
 * @param props - Props of the position detail screen.
 * @param props.data - The overview data, or `null` when the
 *                     position cannot be resolved.
 *
 * @returns The position detail screen.
 *
 * @example
 * <PositionDetail data={DATA} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function PositionDetail({ data }: PositionDetailProps) {
  const DATA = data ?? EMPTY_POSITION_OVERVIEW

  const overview = usePositionOverview(DATA)
  const SUMMARY = overview.summary

  return (
    <EntityDetailShell
      toolbar={
        <EntityDatatableToolbar
          filters={
            <EntityDateRangeFilter
              value={overview.dateRange}
              onChange={overview.onDateRangeChange}
              isDateDisabled={(date) =>
                !overview.isPerformanceDay(date)
              }
              placeholder={
                POSITION_SUMMARY.FILTER_DATE_PLACEHOLDER
              }
              numberOfMonths={1}
            />
          }
        />
      }
    >
      {SUMMARY ? (
        <EntityDetailSummary {...SUMMARY} />
      ) : (
        <EntityEmptyTable
          icon={IconChartLine}
          title={POSITION_SUMMARY.EMPTY_TITLE}
          description={POSITION_SUMMARY.EMPTY_DESCRIPTION}
        />
      )}

      <EntityChartSections sections={overview.chartSections} />

      <PositionActivityDatatable rows={overview.activityRows} />
    </EntityDetailShell>
  )
}

export { PositionDetail }
