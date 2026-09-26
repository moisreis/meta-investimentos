// Native select value sent when every position should
// be calculated.
export const POSITION_PERFORMANCE_ALL_POSITIONS_VALUE =
  "all" as const

// Datatable copy for the position performance screen.
export const POSITION_PERFORMANCE_DATATABLE = {
  // Position column header.
  COLUMN_POSITION: "Posição",

  // Date column header.
  COLUMN_DATE: "Data",

  // Patrimony column header.
  COLUMN_PATRIMONY: "Patrimônio",

  // Quotas column header.
  COLUMN_QUOTAS: "Quotas",

  // Daily return column header.
  COLUMN_RETURN_DAILY: "Rentabilidade",

  // Position filter placeholder.
  FILTER_POSITION_PLACEHOLDER: "Posição",

  // Date range filter placeholder.
  FILTER_DATE_PLACEHOLDER: "Selecione um período",

  // Position filter accessibility label.
  FILTER_POSITION_LABEL: "Filtrar por posição",
} as const

// Calculation flow copy.
export const POSITION_PERFORMANCE_CALCULATE = {
  // Calculate action button label.
  BUTTON_LABEL: "Calcular Desempenho",

  // Confirm dialog header.
  CONFIRM_TITLE: "Calcular desempenho",

  // Confirm dialog description.
  CONFIRM_DESCRIPTION:
    "Escolha a posição e o período para calcular as performances.",

  // Position field label.
  FIELD_POSITION: "Posição",

  // Position field description.
  FIELD_POSITION_DESCRIPTION:
    "Aplique o cálculo a uma posição ou a todas.",

  // Option label offered for every position.
  ALL_POSITIONS_LABEL: "Todas as posições",

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
    "Calculando as performances das posições no período.",

  // Running status marker content.
  PROGRESS_RUNNING_LABEL: "Processando cálculos...",

  // Progress dialog header on success.
  SUCCESS_TITLE: "Cálculo concluído",

  // Progress dialog description on success.
  SUCCESS_DESCRIPTION:
    "As performances do período foram calculadas.",

  // Calculated units summary label.
  CALCULATED_LABEL: "performances calculadas",

  // Positions summary label.
  POSITIONS_LABEL: "posições processadas",

  // Done button content.
  DONE_BUTTON: "Concluir",

  // Progress dialog header on error.
  ERROR_TITLE: "Falha no cálculo",

  // Progress dialog description on error.
  ERROR_DESCRIPTION: "Não foi possível concluir o cálculo.",

  // Close button content.
  CLOSE_BUTTON: "Fechar",
} as const

// KPI copy for the position performance list.
export const POSITION_PERFORMANCE_KPI = {
  // Latest patrimony KPI title.
  PATRIMONY_TITLE: "Patrimônio total",

  // Latest patrimony KPI comparison.
  PATRIMONY_COMPARISON: "últimos cálculos por posição",

  // Row count KPI title.
  ROW_COUNT_TITLE: "Performances",

  // Row count KPI comparison.
  ROW_COUNT_COMPARISON: "registros calculados",

  // Position count KPI title.
  POSITION_COUNT_TITLE: "Posições",

  // Position count KPI comparison.
  POSITION_COUNT_COMPARISON: "posições com cálculo",
} as const

// Empty state copy for the position performance list.
export const POSITION_PERFORMANCE_EMPTY = {
  TITLE: "Nenhuma performance calculada",
  DESCRIPTION:
    "Calcule o desempenho das posições para visualizar os resultados.",
  PRIMARY_ACTION_LABEL: "Calcular desempenho",
} as const
