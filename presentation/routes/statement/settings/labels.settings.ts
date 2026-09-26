// Form copy for the statement generate screen.
export const STATEMENT_FORM = {
  // Generate button content.
  GENERATE_BUTTON: "Gerar Relatório",

  // Generate pending button content.
  GENERATE_PENDING_BUTTON: "Gerando relatório",

  // Success toast title after generating a statement.
  GENERATE_SUCCESS_TITLE: "Relatório gerado!",

  // Success toast description after generating a statement.
  GENERATE_SUCCESS_DESCRIPTION:
    "O relatório foi gerado com sucesso.",

  // Error toast title for the generate form.
  ERROR_TITLE: "Não foi possível gerar o relatório",
} as const

// Dialog copy for the statement generate flow.
export const STATEMENT_DIALOG = {
  // Generate dialog header.
  GENERATE_TITLE: "Gerar relatório",
  GENERATE_DESCRIPTION:
    "Selecione a carteira e o mês de referência.",

  // Portfolio field copy.
  FIELD_PORTFOLIO: "Carteira",
  FIELD_PORTFOLIO_PLACEHOLDER: "Selecione uma carteira",

  // Month field copy.
  FIELD_MONTH: "Mês de referência",
} as const

// Datatable copy for the statement list screen.
export const STATEMENT_DATATABLE = {
  // Column headers.
  COLUMN_PERIOD: "Competência",
  COLUMN_PORTFOLIO: "Carteira",
  COLUMN_FILE: "Arquivo",
  COLUMN_GENERATED_BY: "Gerado por",
  COLUMN_CREATED_AT: "Gerado em",

  // File column open link.
  COLUMN_FILE_OPEN_LABEL: "Abrir",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por carteira",

  // Toolbar generate report button.
  GENERATE_REPORT_LABEL: "Gerar Relatório",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_OPEN_LABEL: "Abrir",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir relatório",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Relatório excluído!",
  DELETE_SUCCESS_DESCRIPTION:
    "O relatório foi excluído com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir o relatório",

  // Bulk delete result toast copy.
  BULK_DELETE_SUCCESS_TITLE: "Relatórios excluídos!",
  BULK_DELETE_SUCCESS_DESCRIPTION:
    "Os relatórios selecionados foram excluídos.",
  BULK_DELETE_ERROR_TITLE:
    "Não foi possível excluir os relatórios",
} as const

// Column id to header label used by the edit-columns menu.
export const STATEMENT_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  period: STATEMENT_DATATABLE.COLUMN_PERIOD,
  portfolio: STATEMENT_DATATABLE.COLUMN_PORTFOLIO,
  file: STATEMENT_DATATABLE.COLUMN_FILE,
  generatedBy: STATEMENT_DATATABLE.COLUMN_GENERATED_BY,
  createdAt: STATEMENT_DATATABLE.COLUMN_CREATED_AT,
}

// KPI card copy for the statement list screen.
export const STATEMENT_KPI = {
  // Total statements card.
  TOTAL_TITLE: "Relatórios",
  TOTAL_COMPARISON: "relatórios gerados",

  // Portfolio coverage card.
  PORTFOLIOS_TITLE: "Carteiras",
  PORTFOLIOS_COMPARISON: "carteiras com relatórios",

  // Performed months card.
  MONTHS_TITLE: "Competências",
  MONTHS_COMPARISON: "meses cobertos",

  // Current month card.
  CURRENT_MONTH_TITLE: "Mês atual",
  CURRENT_MONTH_COMPARISON: "relatórios do mês",
} as const

// Formats the delete dialog description with the period.
function FormatDeleteStatementDescription(
  period: string,
  portfolioName: string
): string {
  const PORTFOLIO = portfolioName
    ? ` da carteira "${portfolioName}"`
    : ""

  return (
    `Deseja excluir o relatório de ${period}${PORTFOLIO}? ` +
    "Esta ação não pode ser desfeita."
  )
}

// Empty state copy for the statement list screen.
export const STATEMENT_EMPTY = {
  TITLE: "Nenhum relatório gerado",
  DESCRIPTION:
    "Gere o primeiro relatório de uma carteira para " +
    "acompanhar a movimentação do período.",
  PRIMARY_ACTION_LABEL: STATEMENT_FORM.GENERATE_BUTTON,
} as const

export { FormatDeleteStatementDescription }
