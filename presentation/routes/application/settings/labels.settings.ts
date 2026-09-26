// Form copy for the application add flow.
export const APPLICATION_FORM = {
  // Add button content.
  ADD_BUTTON: "Registrar aplicação",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Registrando aplicação",

  // Success toast title after recording an application.
  CREATE_SUCCESS_TITLE: "Aplicação registrada!",

  // Success toast description after recording an
  // application.
  CREATE_SUCCESS_DESCRIPTION:
    "A aplicação foi registrada e a posição atualizada.",

  // Error toast title for the application form.
  ERROR_TITLE: "Não foi possível registrar a aplicação",

  // Field labels.
  FIELD_FUND: "Fundo",
  FIELD_DATE: "Data",
  FIELD_AMOUNT: "Valor aplicado",

  // Field descriptions.
  DESCRIPTION_FUND:
    "A posição é criada automaticamente para fundos " +
    "ainda não presentes na carteira.",
  DESCRIPTION_DATE:
    "As cotas são calculadas pelo valor da cota deste dia.",
  DESCRIPTION_AMOUNT: "Valor em reais do aporte.",

  // Select placeholders.
  PLACEHOLDER_FUND: "Selecione o fundo",
  PLACEHOLDER_DATE: "Selecione a data",

  // Fund combobox empty copy.
  SEARCH_EMPTY: "Nenhum resultado encontrado",
} as const

// Dialog copy for the application add flow.
export const APPLICATION_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Nova aplicação",
  ADD_DESCRIPTION: "Informe o fundo, a data e o valor aplicado.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outra aplicação?",
  ADD_ANOTHER_DESCRIPTION:
    "A aplicação foi registrada. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a carteira",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outra",
} as const

// Toolbar copy for the application entry point of the
// portfolio detail screen.
export const APPLICATION_ADD_BUTTON = "Nova aplicação" as const

// Datatable copy for the application list screen.
export const APPLICATION_DATATABLE = {
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

// KPI copy for the application list screen.
export const APPLICATION_KPI = {
  // Total amount KPI title.
  TOTAL_AMOUNT_TITLE: "Valor aplicado",

  // Total amount KPI comparison.
  TOTAL_AMOUNT_COMPARISON: "Aplicações não revertidas",

  // Total quotas KPI title.
  TOTAL_QUOTAS_TITLE: "Cotas adquiridas",

  // Total quotas KPI comparison.
  TOTAL_QUOTAS_COMPARISON: "Aplicações não revertidas",

  // Row count KPI title.
  ROW_COUNT_TITLE: "Aplicações",

  // Row count KPI comparison.
  ROW_COUNT_COMPARISON: "Total de lançamentos",
} as const

// Empty state copy for the application list screen.
export const APPLICATION_EMPTY = {
  TITLE: "Nenhuma aplicação registrada",
  DESCRIPTION:
    "As aplicações aparecerão aqui após serem registradas nas carteiras.",
} as const
