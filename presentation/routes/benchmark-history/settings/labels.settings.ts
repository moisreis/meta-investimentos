import { FormatMonth } from "@/presentation/presenters/date.presenter"

import { BuildBenchmarkHistoryMonthDate } from "../helpers/build-benchmark-history-month.helper"

/**
 * @summary
 * Copy for the index history list screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */

// Datatable copy for the index history list screen.
export const BENCHMARK_HISTORY_DATATABLE = {
  // Column headers.
  COLUMN_DATE: "Data",
  COLUMN_BENCHMARK: "Índice",
  COLUMN_RATE: "Taxa",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por índice ou taxa",

  // Row actions menu copy.
  ROW_ACTIONS_LABEL: "Ações da taxa",
  ROW_EDIT_LABEL: "Editar taxa",
  ROW_DELETE_LABEL: "Excluir taxa",

  // Single-row delete confirmation copy.
  DELETE_TITLE: "Excluir taxa de índice",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Taxa excluída!",
  DELETE_SUCCESS_DESCRIPTION: "A taxa foi excluída com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir a taxa",
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

// Form copy for the record rate flow.
export const BENCHMARK_HISTORY_FORM = {
  // Add button content.
  ADD_BUTTON: "Registrar Taxa",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Registrando taxa",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after recording a rate.
  CREATE_SUCCESS_TITLE: "Taxa registrada!",

  // Success toast description after recording a rate.
  CREATE_SUCCESS_DESCRIPTION:
    "A taxa do índice foi registrada com sucesso.",

  // Success toast title after correcting a rate.
  UPDATE_SUCCESS_TITLE: "Taxa atualizada!",

  // Success toast description after correcting a rate.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the history form.
  ERROR_TITLE: "Não foi possível registrar a taxa",

  // Error toast title for the edit history form.
  UPDATE_ERROR_TITLE: "Não foi possível atualizar a taxa",

  // Index picker field label.
  LABEL_BENCHMARK: "Índice",

  // Index picker field placeholder.
  PLACEHOLDER_BENCHMARK: "Selecione o índice",

  // Index picker empty copy.
  SEARCH_EMPTY: "Nenhum índice encontrado.",

  // Reference month field label.
  LABEL_MONTH: "Mês de referência",

  // Reference month field placeholder.
  PLACEHOLDER_MONTH: "Selecione o mês",

  // Reference month accessible grid label.
  MONTH_GRID_LABEL: "Calendário de meses de referência",

  // Rate field label.
  LABEL_RATE: "Taxa",

  // Rate field placeholder.
  PLACEHOLDER_RATE: "Ex.: 1,23",
} as const

// Dialog copy for the record rate flow.
export const BENCHMARK_HISTORY_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Registrar taxa de índice",
  ADD_DESCRIPTION:
    "Informe o índice, o mês de referência e a taxa do período.",

  // Edit dialog header.
  EDIT_TITLE: "Editar taxa de índice",
  EDIT_DESCRIPTION:
    "Corrija o índice, o mês de referência ou a taxa do período.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Registrar outra taxa?",
  ADD_ANOTHER_DESCRIPTION:
    "A taxa foi registrada com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Registrar outra",
} as const

// KPI card copy for the index history list screen.
export const BENCHMARK_HISTORY_KPI = {
  // Total entries card.
  TOTAL_TITLE: "Registros",
  TOTAL_COMPARISON: "taxas registradas",

  // Index coverage card.
  BENCHMARKS_TITLE: "Índices",
  BENCHMARKS_COMPARISON: "índices com histórico",

  // Date range card.
  RANGE_TITLE: "Período",
  RANGE_COMPARISON: "datas cobertas",
} as const

// Empty state copy for the index history list screen.
export const BENCHMARK_HISTORY_EMPTY = {
  TITLE: "Nenhum histórico de índice",
  DESCRIPTION:
    "As taxas dos índices aparecerão aqui conforme forem registradas.",
  PRIMARY_ACTION_LABEL: BENCHMARK_HISTORY_FORM.ADD_BUTTON,
} as const

/**
 * @summary
 * Formats the delete dialog description of an entry.
 *
 * @remarks
 * Names the entry by its index and its month, because that pair
 * is what makes an entry unique: a rate on its own says nothing
 * about which row is about to be removed.
 *
 * @param acronym - The acronym of the index of the entry.
 * @param date - The stored date of the entry.
 *
 * @returns The delete dialog description.
 *
 * @example
 * const DESCRIPTION = FormatDeleteBenchmarkHistoryDescription(
 *   "CDI",
 *   "2026-03-01T00:00:00.000Z"
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function FormatDeleteBenchmarkHistoryDescription(
  acronym: string,
  date: string
): string {
  return (
    `Deseja excluir a taxa de "${acronym}" em ` +
    `${FormatMonth(BuildBenchmarkHistoryMonthDate(date))}? ` +
    "Esta ação não pode ser desfeita."
  )
}

export { FormatDeleteBenchmarkHistoryDescription }
