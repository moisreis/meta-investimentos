"use client"

import { IconCoins } from "@tabler/icons-react"

import { SharedDatatableSection } from "@/presentation/parts/datatable/layout/shared-datatable-section"

import { useFundLinkedPositionsTable } from "../hooks/use-fund-linked-positions-table.hook"
import { FUND_LINKED_POSITIONS } from "../settings/labels.settings"
import type { FundLinkedPositionRow } from "../types/fund-overview.types"

/**
 * Props of the linked positions section.
 */
export interface FundLinkedPositionsDatatableProps {
  // The positions of the session user holding the fund.
  rows: readonly FundLinkedPositionRow[]
}

/**
 * @summary
 * Renders the linked positions section of the fund detail
 * screen.
 *
 * @remarks
 * Renders the read-only positions datatable, built from
 * the rows resolved by the loader through the section
 * hook, under one quiet heading. An empty list swaps the
 * datatable for the shared empty state, so a fund without
 * positions of the session user explains itself instead
 * of presenting an empty frame.
 *
 * @param props - Props of the linked positions section.
 * @param props.rows - The positions linked to the fund.
 *
 * @returns The linked positions section.
 *
 * @example
 * <FundLinkedPositionsDatatable rows={ROWS} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function FundLinkedPositionsDatatable({
  rows,
}: FundLinkedPositionsDatatableProps) {
  const { hasRows, table } = useFundLinkedPositionsTable(rows)

  return (
    <SharedDatatableSection
      titleId="fund-linked-positions-title"
      title={FUND_LINKED_POSITIONS.TITLE}
      description={FUND_LINKED_POSITIONS.DESCRIPTION}
      table={table}
      hasRows={hasRows}
      emptyIcon={IconCoins}
      emptyTitle={FUND_LINKED_POSITIONS.EMPTY_TITLE}
      emptyDescription={FUND_LINKED_POSITIONS.EMPTY_DESCRIPTION}
    />
  )
}

export { FundLinkedPositionsDatatable }
