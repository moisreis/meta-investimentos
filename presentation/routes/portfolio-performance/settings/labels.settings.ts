// Native select value sent when every portfolio should
// be calculated.
export const PORTFOLIO_PERFORMANCE_ALL_PORTFOLIOS_VALUE =
  "all" as const

// Datatable copy for the performance list screen.
export const PORTFOLIO_PERFORMANCE_DATATABLE = {
  // Portfolio column header.
  COLUMN_PORTFOLIO: "Carteira",

  // Date column header.
  COLUMN_DATE: "Data",

  // Patrimony column header.
  COLUMN_PATRIMONY: "Patrimônio",

  // Quotas column header.
  COLUMN_QUOTAS: "Quotas",

  // Daily return column header.
  COLUMN_RETURN_DAILY: "Rentabilidade",

  // Portfolio filter placeholder.
  FILTER_PORTFOLIO_PLACEHOLDER: "Carteira",

  // Date range filter placeholder.
  FILTER_DATE_PLACEHOLDER: "Selecione um período",

  // Portfolio filter accessibility label.
  FILTER_PORTFOLIO_LABEL: "Filtrar por carteira",
} as const

// Calculation flow copy.
export const PORTFOLIO_PERFORMANCE_CALCULATE = {
  // Calculate action button label.
  BUTTON_LABEL: "Calcular Desempenho",

  // Confirm dialog header.
  CONFIRM_TITLE: "Calcular desempenho",

  // Confirm dialog description.
  CONFIRM_DESCRIPTION:
    "Escolha a carteira e o período para calcular as performances.",

  // Portfolio field label.
  FIELD_PORTFOLIO: "Carteira",

  // Portfolio field description.
  FIELD_PORTFOLIO_DESCRIPTION:
    "Aplique o cálculo a uma carteira ou a todas.",

  // Option label offered for every portfolio.
  ALL_PORTFOLIOS_LABEL: "Todas as carteiras",

  // Date range field label.
  FIELD_DATE_RANGE: "Período",

  // Missing range error message.
  DATE_RANGE_REQUIRED: "Selecione um período para calcular.",

  // Confirm button content.
  CONFIRM_BUTTON: "Calcular",

  // Confirm pending button content.
  CONFIRM_PENDING_BUTTON: "Preparando cálculo",

  // Cancel button content.
  CANCEL_BUTTON: "Cancelar",

  // Start error generic label.
  START_ERROR: "Não foi possível iniciar o cálculo.",

  // Progress dialog header while running.
  PROGRESS_TITLE: "Calculando desempenho",

  // Progress dialog description while running.
  PROGRESS_DESCRIPTION:
    "Calculando as performances das carteiras no período.",

  // Running status marker content.
  PROGRESS_RUNNING_LABEL: "Processando cálculos...",

  // Progress dialog header on success.
  SUCCESS_TITLE: "Cálculo concluído",

  // Progress dialog description on success.
  SUCCESS_DESCRIPTION:
    "As performances do período foram calculadas.",

  // Calculated units summary label.
  CALCULATED_LABEL: "performances calculadas",

  // Portfolios summary label.
  PORTFOLIOS_LABEL: "carteiras processadas",

  // Done button content.
  DONE_BUTTON: "Concluir",

  // Progress dialog header on error.
  ERROR_TITLE: "Falha no cálculo",

  // Progress dialog description on error.
  ERROR_DESCRIPTION: "Não foi possível concluir o cálculo.",

  // Close button content.
  CLOSE_BUTTON: "Fechar",
} as const

// KPI copy for the performance list.
export const PORTFOLIO_PERFORMANCE_KPI = {
  // Latest patrimony KPI title.
  PATRIMONY_TITLE: "Patrimônio total",

  // Latest patrimony KPI comparison.
  PATRIMONY_COMPARISON: "últimos cálculos por carteira",

  // Row count KPI title.
  ROW_COUNT_TITLE: "Performances",

  // Row count KPI comparison.
  ROW_COUNT_COMPARISON: "registros calculados",

  // Portfolio count KPI title.
  PORTFOLIO_COUNT_TITLE: "Carteiras",

  // Portfolio count KPI comparison.
  PORTFOLIO_COUNT_COMPARISON: "carteiras com cálculo",
} as const

// Empty state copy for the performance list.
export const PORTFOLIO_PERFORMANCE_EMPTY = {
  TITLE: "Nenhuma performance calculada",
  DESCRIPTION:
    "Calcule o desempenho das carteiras para visualizar os resultados.",
  PRIMARY_ACTION_LABEL: "Calcular desempenho",
} as const
