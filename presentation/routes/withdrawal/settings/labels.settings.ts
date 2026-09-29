/**
 * @summary
 * Form copy for the withdrawal add flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
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
  FIELD_PORTFOLIO: "Carteira",
  FIELD_POSITION: "Posição",
  FIELD_DATE: "Data",
  FIELD_AMOUNT: "Valor resgatado",

  // Field descriptions.
  DESCRIPTION_PORTFOLIO:
    "Só as posições desta carteira são oferecidas abaixo.",
  DESCRIPTION_POSITION:
    "O resgate é lançado na posição do fundo escolhido.",
  DESCRIPTION_DATE:
    "As cotas são calculadas pelo valor da cota deste dia.",
  DESCRIPTION_AMOUNT: "Valor em reais do resgate.",

  // Select placeholders.
  PLACEHOLDER_PORTFOLIO: "Selecione a carteira",
  PLACEHOLDER_POSITION: "Selecione a posição",
  PLACEHOLDER_DATE: "Selecione a data",

  // Portfolio combobox empty copy.
  SEARCH_EMPTY_PORTFOLIO: "Nenhuma carteira encontrada",

  // Position combobox empty copy.
  SEARCH_EMPTY: "Nenhuma posição encontrada",

  // Position combobox empty copy while no portfolio is
  // picked, which is what leaves the list without options.
  SEARCH_EMPTY_WITHOUT_PORTFOLIO:
    "Escolha a carteira para listar as posições.",
} as const

// Dialog copy for the withdrawal add flow.
export const WITHDRAWAL_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Novo resgate",
  ADD_DESCRIPTION:
    "Informe a carteira, a posição, a data e o valor resgatado.",

  // Add dialog header when the portfolio is locked to the
  // one the flow was opened from, so the copy does not ask
  // for a field the form no longer shows.
  ADD_DESCRIPTION_LOCKED:
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
  DELETE_TITLE: "Excluir resgate",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Resgate excluído!",
  DELETE_SUCCESS_DESCRIPTION: "O resgate foi excluído com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir o resgate",

  // Single reverse dialog.
  REVERSE_TITLE: "Reverter resgate",
  REVERSE_CONFIRM_LABEL: "Reverter",
  REVERSE_CANCEL_LABEL: "Cancelar",

  // Reverse result toast copy.
  REVERSE_SUCCESS_TITLE: "Resgate revertido!",
  REVERSE_SUCCESS_DESCRIPTION:
    "O resgate foi marcado como estornado.",
  REVERSE_ERROR_TITLE: "Não foi possível reverter o resgate",
} as const

// Copy used to describe the row before a single reverse.
export function FormatReverseWithdrawalDescription(
  movementLabel: string
): string {
  return `Deseja reverter o resgate de ${movementLabel}? O lançamento será marcado como estornado.`
}

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
  PRIMARY_ACTION_LABEL: "Registrar resgate",
} as const

