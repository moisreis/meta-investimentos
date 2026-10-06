"use client"

import { type DateRange } from "react-day-picker"
import { EntityDatatableToolbarSeparator } from "@/presentation/parts/components/entity-datatable-toolbar-separator"
import { EntityDateRangeFilter } from "@/presentation/parts/filters/entity-date-range"
import { EntitySelectFilter } from "@/presentation/parts/filters/entity-select-filter"
import { QUOTA_DATATABLE } from "../settings/labels.settings"
import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

interface QuotaDatatableFiltersProps {
  fundId: string | undefined
  onFundChange: (fundId: string | undefined) => void
  fundOptions: EntitySelectFilterOption[]
  dateRange: DateRange | undefined
  onDateRangeChange: (dateRange: DateRange | undefined) => void
}

/**
 * @summary
 * Composes the quota datatable filters.
 *
 * @remarks
 * Renders the fund select filter and date range filter on the
 * toolbar, narrowing the table by the selected fund and
 * date range. A separator splits the two, so the fund reads as
 * the subject of the list and the period as the window over
 * it, matching the position toolbar.
 *
 * @param props - The filter state and handlers.
 * @param props.fundId - The selected fund id.
 * @param props.onFundChange - Reports the next fund id.
 * @param props.fundOptions - The fund options for the select.
 * @param props.dateRange - The selected date range.
 * @param props.onDateRangeChange - Reports the next date range.
 *
 * @returns The composed quota filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function QuotaDatatableFilters({
  fundId,
  onFundChange,
  fundOptions,
  dateRange,
  onDateRangeChange,
}: QuotaDatatableFiltersProps) {
  return (
    <>
      <EntitySelectFilter
        value={fundId}
        onChange={onFundChange}
        options={fundOptions}
        placeholder={QUOTA_DATATABLE.FILTER_FUND_PLACEHOLDER}
        label={QUOTA_DATATABLE.FILTER_FUND_LABEL}
      />

      <EntityDatatableToolbarSeparator />

      <EntityDateRangeFilter
        value={dateRange}
        onChange={onDateRangeChange}
        placeholder={QUOTA_DATATABLE.FILTER_DATE_PLACEHOLDER}
        numberOfMonths={2}
      />
    </>
  )
}

export { QuotaDatatableFilters }
