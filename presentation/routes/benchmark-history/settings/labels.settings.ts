/**
 * @summary
 * Copy for the benchmark history list screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */

// Datatable copy for the benchmark history list screen.
export const BENCHMARK_HISTORY_DATATABLE = {
  // Column headers.
  COLUMN_DATE: "Data",
  COLUMN_BENCHMARK: "Benchmark",
  COLUMN_RATE: "Taxa",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por benchmark ou taxa",
} as const

// Column id to header label used by the edit-columns menu.
export const BENCHMARK_HISTORY_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  date: BENCHMARK_HISTORY_DATATABLE.COLUMN_DATE,
  benchmark: BENCHMARK_HISTORY_DATATABLE.COLUMN_BENCHMARK,
  rate: BENCHMARK_HISTORY_DATATABLE.COLUMN_RATE,
}

// KPI card copy for the benchmark history list screen.
export const BENCHMARK_HISTORY_KPI = {
  // Total entries card.
  TOTAL_TITLE: "Registros",
  TOTAL_COMPARISON: "taxas registradas",

  // Benchmark coverage card.
  BENCHMARKS_TITLE: "Benchmarks",
  BENCHMARKS_COMPARISON: "benchmarks com histórico",

  // Date range card.
  RANGE_TITLE: "Período",
  RANGE_COMPARISON: "datas cobertas",
} as const

// Empty state copy for the benchmark history list screen.
export const BENCHMARK_HISTORY_EMPTY = {
  TITLE: "Nenhum histórico de benchmark",
  DESCRIPTION:
    "As taxas dos benchmarks aparecerão aqui conforme forem registradas.",
} as const
