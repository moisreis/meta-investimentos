"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

import { GetStatementMonthKey } from "../helpers/format-statement-period.helper"
import { STATEMENT_KPI } from "../settings/labels.settings"

interface UseStatementKpisInput {
  statements: StatementResponseDTO[]
}

// Builds the current UTC month key (`YYYY-MM`).
function CurrentMonthKey(): string {
  return new Date().toISOString().slice(0, 7)
}

// Tallies the data-driven statement KPI cards.
function BuildStatementKpis(
  statements: readonly StatementResponseDTO[]
): EntityKpi[] {
  const COVERED_MONTHS = new Set(
    statements.map((statement) =>
      GetStatementMonthKey(statement.periodStart)
    )
  )
  const COVERED_PORTFOLIOS = new Set(
    statements
      .map((statement) => statement.portfolioId)
      .filter((id): id is string => Boolean(id))
  )
  const CURRENT_KEY = CurrentMonthKey()
  const CURRENT_MONTH_COUNT = statements.filter(
    (statement) =>
      GetStatementMonthKey(statement.periodStart) === CURRENT_KEY
  ).length

  return [
    {
      key: "total",
      title: STATEMENT_KPI.TOTAL_TITLE,
      value: FormatCount(statements.length),
      comparison: STATEMENT_KPI.TOTAL_COMPARISON,
    },
    {
      key: "portfolios",
      title: STATEMENT_KPI.PORTFOLIOS_TITLE,
      value: FormatCount(COVERED_PORTFOLIOS.size),
      comparison: STATEMENT_KPI.PORTFOLIOS_COMPARISON,
    },
    {
      key: "months",
      title: STATEMENT_KPI.MONTHS_TITLE,
      value: FormatCount(COVERED_MONTHS.size),
      comparison: STATEMENT_KPI.MONTHS_COMPARISON,
    },
    {
      key: "currentMonth",
      title: STATEMENT_KPI.CURRENT_MONTH_TITLE,
      value: FormatCount(CURRENT_MONTH_COUNT),
      comparison: STATEMENT_KPI.CURRENT_MONTH_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Builds the data-driven KPI cards of the statement list.
 *
 * @remarks
 * Tallies the total statement count, the distinct covered
 * portfolios and months and the reports of the current month.
 * All values are formatted through the count presenter.
 *
 * @param statements - The rows of the statement list.
 *
 * @returns The statement KPI list.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useStatementKpis({
  statements,
}: UseStatementKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly StatementResponseDTO[]) =>
      BuildStatementKpis(items),
    []
  )

  return useEntityKpis({ items: statements, compute })
}

export { useStatementKpis }
