"use client"

import { useMemo, useState } from "react"

import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

import type { StatementRowSummary } from "../types/statement-list.types"

interface UseStatementDatatableFiltersInput {
  statements: StatementResponseDTO[]
  summaries: Record<string, StatementRowSummary> | null
}

/**
 * @summary
 * Handles the query filter of the statement datatable.
 *
 * @remarks
 * Narrows the rows by the portfolio acronym or name of each
 * statement summary, resolved through the optional summary
 * record.
 *
 * @param statements - The rows rendered by the datatable.
 * @param summaries - Derived per-row data keyed by id.
 *
 * @returns The query state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useStatementDatatableFilters({
  statements,
  summaries,
}: UseStatementDatatableFiltersInput) {
  const [QUERY, setQuery] = useState("")

  const FILTERED = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return statements

    return statements.filter((statement) => {
      const SUMMARY = summaries?.[statement.id]

      return [SUMMARY?.portfolioName, SUMMARY?.portfolioAcronym]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(NORMALIZED)
    })
  }, [statements, summaries, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredStatements: FILTERED,
  }
}

export { useStatementDatatableFilters }
