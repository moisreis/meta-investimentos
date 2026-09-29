/**
 * @summary
 * Form copy for the application add flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export const APPLICATION_FORM = {
  // Add button content.
  ADD_BUTTON: "Registrar aplicação",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Registrando aplicação",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after recording an application.
  CREATE_SUCCESS_TITLE: "Aplicação registrada!",

  // Success toast description after recording an
  // application.
  CREATE_SUCCESS_DESCRIPTION:
    "A aplicação foi registrada e a posição atualizada.",

  // Success toast title after updating an application.
  UPDATE_SUCCESS_TITLE: "Aplicação atualizada!",

  // Success toast description after updating an
  // application.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the application form.
  ERROR_TITLE: "Não foi possível registrar a aplicação",

  // Field labels.
  FIELD_PORTFOLIO: "Carteira",
  FIELD_FUND: "Fundo",
  FIELD_DATE: "Data",
  FIELD_AMOUNT: "Valor aplicado",

  // Field descriptions.
  DESCRIPTION_PORTFOLIO:
    "Carteira que recebe o aporte. A posição do fundo é " +
    "criada nela quando ainda não existir.",
  DESCRIPTION_FUND:
    "A posição é criada automaticamente para fundos " +
    "ainda não presentes na carteira.",
  DESCRIPTION_DATE:
    "As cotas são calculadas pelo valor da cota deste dia.",
  DESCRIPTION_AMOUNT: "Valor em reais do aporte.",

  // Select placeholders.
  PLACEHOLDER_PORTFOLIO: "Selecione a carteira",
  PLACEHOLDER_FUND: "Selecione o fundo",
  PLACEHOLDER_DATE: "Selecione a data",

  // Combobox empty copy.
  SEARCH_EMPTY: "Nenhum resultado encontrado",
} as const

// Dialog copy for the application add flow.
export const APPLICATION_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Nova aplicação",
  ADD_DESCRIPTION:
    "Informe a carteira, o fundo, a data e o valor aplicado.",

  // Add dialog header when the portfolio is locked to the
  // one the flow was opened from, so the copy does not ask
  // for a field the form no longer shows.
  ADD_DESCRIPTION_LOCKED:
    "Informe o fundo, a data e o valor aplicado.",

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

  // Status column header.
  COLUMN_STATUS: "Status",

  // Status badge labels.
  STATUS_ACTIVE_LABEL: "Ativo",
  STATUS_REVERSED_LABEL: "Estornado",

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
  ROW_EDIT_LABEL: "Editar",
  ROW_REVERSE_LABEL: "Reverter",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir aplicação",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Aplicação excluída!",
  DELETE_SUCCESS_DESCRIPTION: "A aplicação foi excluída com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir a aplicação",

  // Single reverse dialog.
  REVERSE_TITLE: "Reverter aplicação",
  REVERSE_CONFIRM_LABEL: "Reverter",
  REVERSE_CANCEL_LABEL: "Cancelar",

  // Reverse result toast copy.
  REVERSE_SUCCESS_TITLE: "Aplicação revertida!",
  REVERSE_SUCCESS_DESCRIPTION:
    "A aplicação foi marcada como estornada.",
  REVERSE_ERROR_TITLE: "Não foi possível reverter a aplicação",
} as const

// Copy used to describe the row before a single reverse.
export function FormatReverseApplicationDescription(
  movementLabel: string
): string {
  return `Deseja reverter a aplicação de ${movementLabel}? O lançamento será marcado como estornado.`
}

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
  PRIMARY_ACTION_LABEL: "Registrar aplicação",
} as const

