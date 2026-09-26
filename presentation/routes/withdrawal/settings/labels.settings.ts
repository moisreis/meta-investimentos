// Form copy for the withdrawal add flow.
export const WITHDRAWAL_FORM = {
  // Add button content.
  ADD_BUTTON: "Registrar resgate",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Registrando resgate",

  // Success toast title after recording a withdrawal.
  CREATE_SUCCESS_TITLE: "Resgate registrado!",

  // Success toast description after recording a
  // withdrawal.
  CREATE_SUCCESS_DESCRIPTION:
    "O resgate foi registrado e a posição atualizada.",

  // Error toast title for the withdrawal form.
  ERROR_TITLE: "Não foi possível registrar o resgate",

  // Field labels.
  FIELD_POSITION: "Posição",
  FIELD_DATE: "Data",
  FIELD_AMOUNT: "Valor resgatado",

  // Field descriptions.
  DESCRIPTION_POSITION:
    "O resgate é lançado na posição do fundo escolhido.",
  DESCRIPTION_DATE:
    "As cotas são calculadas pelo valor da cota deste dia.",
  DESCRIPTION_AMOUNT: "Valor em reais do resgate.",

  // Select placeholders.
  PLACEHOLDER_POSITION: "Selecione a posição",
  PLACEHOLDER_DATE: "Selecione a data",

  // Position combobox empty copy.
  SEARCH_EMPTY: "Nenhuma posição encontrada",
} as const

// Dialog copy for the withdrawal add flow.
export const WITHDRAWAL_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Novo resgate",
  ADD_DESCRIPTION:
    "Informe a posição, a data e o valor resgatado.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outro resgate?",
  ADD_ANOTHER_DESCRIPTION:
    "O resgate foi registrado. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a carteira",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outro",
} as const

// Toolbar copy for the withdrawal entry point of the
// portfolio detail screen.
export const WITHDRAWAL_ADD_BUTTON = "Novo resgate" as const

// Datatable copy for the withdrawal list screen.
export const WITHDRAWAL_DATATABLE = {
  // Portfolio column header.
  COLUMN_PORTFOLIO: "Carteira",

  // Fund column header.
  COLUMN_FUND: "Fundo",

  // Date column header.
  COLUMN_DATE: "Data",

  // Amount column header.
  COLUMN_AMOUNT: "Valor",

  // Quotas column header.
  COLUMN_QUOTAS: "Cotas",

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
} as const

// KPI copy for the withdrawal list screen.
export const WITHDRAWAL_KPI = {
  // Total amount KPI title.
  TOTAL_AMOUNT_TITLE: "Valor resgatado",

  // Total amount KPI comparison.
  TOTAL_AMOUNT_COMPARISON: "Resgates não revertidos",

  // Total quotas KPI title.
  TOTAL_QUOTAS_TITLE: "Cotas resgatadas",

  // Total quotas KPI comparison.
  TOTAL_QUOTAS_COMPARISON: "Resgates não revertidos",

  // Row count KPI title.
  ROW_COUNT_TITLE: "Resgates",

  // Row count KPI comparison.
  ROW_COUNT_COMPARISON: "Total de lançamentos",
} as const

// Empty state copy for the withdrawal list screen.
export const WITHDRAWAL_EMPTY = {
  TITLE: "Nenhum resgate registrado",
  DESCRIPTION:
    "Os resgates aparecerão aqui após serem registrados nas carteiras.",
} as const
