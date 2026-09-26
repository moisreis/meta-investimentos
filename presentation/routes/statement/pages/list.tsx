"use client"

import { IconFileText } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

import { StatementDatatableFilters } from "../datatable/filters"
import { StatementDatatableTable } from "../datatable/table"
import { StatementDatatableToolbar } from "../datatable/toolbar"
import { StatementConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { StatementGenerateReportDialog } from "../dialogs/generate-report"
import { useStatementDatatableFilters } from "../hooks/use-statement-datatable-filters.hook"
import { useStatementDatatable } from "../hooks/use-statement-datatable.hook"
import { useStatementKpis } from "../hooks/use-statement-kpis.hook"
import { STATEMENT_EMPTY } from "../settings/labels.settings"
import type { StatementRowSummary } from "../types/statement-list.types"

interface StatementListProps {
  data: StatementResponseDTO[] | null
  portfolios: PortfolioResponseDTO[]
  summaries: Record<string, StatementRowSummary> | null
}

/**
 * @summary
 * Renders the statement list screen.
 *
 * @remarks
 * Composes the KPI group, the datatable toolbar and the
 * datatable or its empty state. The generate-report dialog
 * replaces the add-item flow of the other registries and the
 * confirm-delete dialog handles the single-row deletion.
 *
 * @param props - The list data and derived summaries.
 * @param props.data - The statement rows.
 * @param props.portfolios - Options of the generate dialog.
 * @param props.summaries - Per-row derived data keyed by id.
 *
 * @returns The statement list screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function StatementList({
  data,
  portfolios,
  summaries,
}: StatementListProps) {
  const STATEMENTS = data ?? []
  const HAS_STATEMENTS = STATEMENTS.length > 0

  const filters = useStatementDatatableFilters({
    statements: STATEMENTS,
    summaries,
  })
  const { table, rowActions, bulkDelete, generateDialog } =
    useStatementDatatable(filters.filteredStatements, summaries)
  const kpis = useStatementKpis({
    statements: STATEMENTS,
  })

  return (
    <>
      <EntityDatatableKpiGroup>
        {kpis.map((kpi) => (
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

      <StatementDatatableToolbar
        table={table}
        onGenerateReport={generateDialog.handleOpen}
        filters={
          <StatementDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {HAS_STATEMENTS ? (
        <StatementDatatableTable
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconFileText}
          title={STATEMENT_EMPTY.TITLE}
          description={STATEMENT_EMPTY.DESCRIPTION}
          primaryActionLabel={
            STATEMENT_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={generateDialog.handleOpen}
        />
      )}

      <StatementGenerateReportDialog
        dialog={generateDialog}
        portfolios={portfolios}
      />
      <StatementConfirmDeleteDialog
        dialog={rowActions}
        summaries={summaries}
      />
    </>
  )
}

export { StatementList }
