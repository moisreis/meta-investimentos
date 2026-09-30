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
  ROW_VIEW_LABEL: "Ver",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir posição",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Posição excluída!",
  DELETE_SUCCESS_DESCRIPTION:
    "A posição foi excluída com sucesso.",
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

// Copy of the extrato summary and of the toolbar filter of
// the position detail screen.
export const POSITION_SUMMARY = {
  // Label of the headline figure, followed by the closing day
  // of the window it was measured on.
  PATRIMONY_LABEL: "Patrimônio em",
  // Qualifier naming the horizon of the return under the
  // headline figure.
  RETURN_NOTE: "no período",

  // Reconciliation figure labels, in reading order.
  OPENING_ENTRY_LABEL: "Saldo inicial",
  DEPOSITS_ENTRY_LABEL: "Entradas",
  WITHDRAWALS_ENTRY_LABEL: "Saídas",
  RESULT_ENTRY_LABEL: "Resultado do período",

  // Toolbar filter copy.
  FILTER_DATE_PLACEHOLDER:
    POSITION_DATATABLE.FILTER_DATE_PLACEHOLDER,

  // Empty state copy for the detail screen.
  EMPTY_TITLE: "Sem desempenho calculado",
  EMPTY_DESCRIPTION:
    "Os números da posição aparecem assim que houver um " +
    "dia de desempenho calculado.",
} as const

// Chart copy for the position detail screen.
export const POSITION_CHARTS = {
  // Patrimony chart.
  PATRIMONY_TITLE: "Evolução do Patrimônio",
  PATRIMONY_DESCRIPTION:
    "Valor da posição ao fim de cada dia do período.",
  PATRIMONY_SERIES: "Patrimônio",
  PATRIMONY_REFERENCE: "Valor no início do período",

  // Return chart.
  RETURN_TITLE: "Rentabilidade",
  RETURN_DESCRIPTION:
    "Retorno de cada dia e rentabilidade acumulada no mês e no ano.",
  RETURN_SERIES_DAILY: "Retorno diário",
  RETURN_SERIES_MONTHLY: "Retorno no mês",
  RETURN_SERIES_YEARLY: "Retorno no ano",

  // Daily result chart.
  RESULT_TITLE: "Resultado Diário",
  RESULT_DESCRIPTION:
    "Ganho de mercado de cada dia, frente ao valor da posição.",
  RESULT_SERIES_EARNINGS: "Ganho de mercado",

  // Cash movement chart.
  MOVEMENT_TITLE: "Entradas e Saídas",
  MOVEMENT_DESCRIPTION:
    "Aplicações e resgates líquidos de cada dia do período.",
  MOVEMENT_SERIES_CASH_FLOW: "Fluxo líquido",
} as const

// Datatable copy for the recent activity section of the
// position detail screen.
export const POSITION_ACTIVITY = {
  // Section title.
  TITLE: "Movimentações do Período",
  // Section description.
  DESCRIPTION:
    "Aplicações e resgates da posição no período selecionado.",

  // Column headers.
  COLUMN_TYPE: "Tipo",
  COLUMN_DATE: "Data",
  COLUMN_FUND: "Fundo",
  COLUMN_AMOUNT: "Valor",
  COLUMN_QUOTAS: "Cotas",

  // Type badges.
  TYPE_APPLICATION: "Aplicação",
  TYPE_WITHDRAWAL: "Resgate",

  // Empty state of the section.
  EMPTY_TITLE: "Nenhuma movimentação no período",
  EMPTY_DESCRIPTION:
    "As aplicações e os resgates da posição aparecem aqui " +
    "assim que houver um lançamento no período selecionado.",
} as const

// Section copy of the position detail charts. Each chart
// carries its own description inside its card, so a section
// states only the question its charts answer.
export const POSITION_CHART_SECTIONS = {
  // Windowed performance section.
  PERFORMANCE_TITLE: "Desempenho no período",

  // Annual monthly history section.
  ANNUAL_TITLE: "Análise do ano",
} as const

// Chart copy for the annual monthly history of the position
// detail screen.
export const POSITION_ANNUAL = {
  // Monthly earnings chart.
  EARNINGS_TITLE: "Rendimento Mensal",
  EARNINGS_DESCRIPTION:
    "Soma dos rendimentos de mercado de cada mês do ano.",
  EARNINGS_SERIES: "Rendimento",

  // Monthly patrimony chart.
  PATRIMONY_TITLE: "Patrimônio Mensal",
  PATRIMONY_DESCRIPTION:
    "Patrimônio da posição ao fim de cada mês do ano.",
  PATRIMONY_SERIES: "Patrimônio",

  // Monthly return chart.
  RETURN_TITLE: "Retorno Mensal",
  RETURN_DESCRIPTION: "Retorno acumulado de cada mês do ano.",
  RETURN_SERIES: "Retorno no mês",
} as const
