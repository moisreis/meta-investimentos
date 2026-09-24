// Form copy for the portfolio add/edit screens.
export const PORTFOLIO_FORM = {
  // Add button content.
  ADD_BUTTON: "Criar Carteira",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Criando carteira",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a portfolio.
  CREATE_SUCCESS_TITLE: "Carteira criada!",

  // Success toast description after creating a portfolio.
  CREATE_SUCCESS_DESCRIPTION:
    "A carteira foi cadastrada com sucesso.",

  // Success toast title after updating a portfolio.
  UPDATE_SUCCESS_TITLE: "Carteira atualizada!",

  // Success toast description after updating a portfolio.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the portfolio forms.
  ERROR_TITLE: "Não foi possível salvar a carteira",
} as const

// Datatable copy for the portfolio list screen.
export const PORTFOLIO_DATATABLE = {
  // Column headers.
  COLUMN_ACRONYM: "Sigla",
  COLUMN_NAME: "Nome",
  COLUMN_ANNUAL_INTEREST_RATE: "Taxa Anual",
  COLUMN_MIN_ALLOCATION: "Alocação Mín.",
  COLUMN_TARGET_ALLOCATION: "Alocação Alvo",
  COLUMN_MAX_ALLOCATION: "Alocação Máx.",
  COLUMN_CREATED_AT: "Criado em",
  COLUMN_UPDATED_AT: "Atualizado em",

  // Row actions menu.
  ROW_EDIT_LABEL: "Editar",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir carteira",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Carteira excluída!",
  DELETE_SUCCESS_DESCRIPTION:
    "A carteira foi excluída com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir a carteira",

  // Bulk delete result toast copy.
  BULK_DELETE_SUCCESS_TITLE: "Carteiras excluídas!",
  BULK_DELETE_SUCCESS_DESCRIPTION:
    "As carteiras selecionadas foram excluídas.",
  BULK_DELETE_ERROR_TITLE:
    "Não foi possível excluir as carteiras",
} as const

// Column id to header label used by the edit-columns menu.
export const PORTFOLIO_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  acronym: PORTFOLIO_DATATABLE.COLUMN_ACRONYM,
  name: PORTFOLIO_DATATABLE.COLUMN_NAME,
  annualInterestRate:
    PORTFOLIO_DATATABLE.COLUMN_ANNUAL_INTEREST_RATE,
  minAllocation: PORTFOLIO_DATATABLE.COLUMN_MIN_ALLOCATION,
  targetAllocation: PORTFOLIO_DATATABLE.COLUMN_TARGET_ALLOCATION,
  maxAllocation: PORTFOLIO_DATATABLE.COLUMN_MAX_ALLOCATION,
  createdAt: PORTFOLIO_DATATABLE.COLUMN_CREATED_AT,
  updatedAt: PORTFOLIO_DATATABLE.COLUMN_UPDATED_AT,
}

// Formats the row actions menu label with the acronym.
function FormatPortfolioRowActionsLabel(
  acronym: string
): string {
  return `Ações de ${acronym}`
}

// Formats the delete dialog description with the name.
function FormatDeletePortfolioDescription(name: string): string {
  return (
    `Deseja excluir a carteira "${name}"? ` +
    "Esta ação não pode ser desfeita."
  )
}

export {
  FormatDeletePortfolioDescription,
  FormatPortfolioRowActionsLabel,
}
