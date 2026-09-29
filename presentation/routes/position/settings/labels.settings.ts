/**
 * @summary
 * Datatable copy for the position list screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export const POSITION_DATATABLE = {
  // Portfolio column header.
  COLUMN_PORTFOLIO: "Carteira",

  // Fund column header.
  COLUMN_FUND: "Fundo",

  // Opening date column header.
  COLUMN_OPENED_AT: "Abertura",

  // Initial balance column header.
  COLUMN_INITIAL_BALANCE: "Saldo inicial",

  // Portfolio filter placeholder.
  FILTER_PORTFOLIO_PLACEHOLDER: "Carteira",

  // Fund filter placeholder.
  FILTER_FUND_PLACEHOLDER: "Fundo",

  // Date range filter placeholder.
  FILTER_DATE_PLACEHOLDER: "Selecione um período",

  // Portfolio filter accessibility label.
  FILTER_PORTFOLIO_LABEL: "Filtrar por carteira",

  // Fund filter accessibility label.
  FILTER_FUND_LABEL: "Filtrar por fundo",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir posição",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Posição excluída!",
  DELETE_SUCCESS_DESCRIPTION: "A posição foi excluída com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir a posição",
} as const

// KPI copy for the position list screen.
export const POSITION_KPI = {
  // Total balance KPI title.
  TOTAL_BALANCE_TITLE: "Saldo inicial total",

  // Total balance KPI comparison.
  TOTAL_BALANCE_COMPARISON: "Capital de abertura",

  // Row count KPI title.
  ROW_COUNT_TITLE: "Posições",

  // Row count KPI comparison.
  ROW_COUNT_COMPARISON: "Total de vínculos",

  // Fund count KPI title.
  FUND_COUNT_TITLE: "Fundos vinculados",

  // Fund count KPI comparison.
  FUND_COUNT_COMPARISON: "Fundos distintos",
} as const

// Empty state copy for the position list screen.
export const POSITION_EMPTY = {
  TITLE: "Nenhuma posição registrada",
  DESCRIPTION:
    "As posições aparecerão aqui após serem criadas nas carteiras.",
} as const

