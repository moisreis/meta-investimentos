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

// Dialog copy for the portfolio add/edit flows.
export const PORTFOLIO_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Nova carteira",
  ADD_DESCRIPTION: "Preencha os dados da nova carteira.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outra carteira?",
  ADD_ANOTHER_DESCRIPTION:
    "A carteira foi criada com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outra",

  // Edit dialog header.
  EDIT_TITLE: "Editar carteira",
  EDIT_DESCRIPTION: "Atualize os dados da carteira.",
} as const

// Datatable copy for the portfolio list screen.
export const PORTFOLIO_DATATABLE = {
  // Column headers.
  COLUMN_ACRONYM: "Sigla",
  COLUMN_NAME: "Nome",
  COLUMN_ANNUAL_INTEREST_RATE: "Taxa Anual",
  COLUMN_FUND_COUNT: "Nº de Fundos",
  COLUMN_BANK_ACCOUNT_COUNT: "Nº de Contas Bancárias",
  COLUMN_OWNER: "Proprietário",

  // Performance column headers.
  COLUMN_PATRIMONY: "Patrimônio",
  COLUMN_EARNINGS: "Rendimento",
  COLUMN_RETURN_DAILY: "Ret. Diário",
  COLUMN_RETURN_MONTHLY: "Ret. Mensal",

  // Toolbar filter copy.
  FILTER_DATE_RANGE_PLACEHOLDER: "Selecione um período",
  FILTER_SEARCH_PLACEHOLDER: "Buscar por nome",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_VIEW_LABEL: "Ver",
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
  fundCount: PORTFOLIO_DATATABLE.COLUMN_FUND_COUNT,
  bankAccountCount:
    PORTFOLIO_DATATABLE.COLUMN_BANK_ACCOUNT_COUNT,
  owner: PORTFOLIO_DATATABLE.COLUMN_OWNER,
  patrimony: PORTFOLIO_DATATABLE.COLUMN_PATRIMONY,
  earnings: PORTFOLIO_DATATABLE.COLUMN_EARNINGS,
  returnDaily: PORTFOLIO_DATATABLE.COLUMN_RETURN_DAILY,
  returnMonthly: PORTFOLIO_DATATABLE.COLUMN_RETURN_MONTHLY,
}

// KPI card copy for the portfolio list screen.
export const PORTFOLIO_KPI = {
  // Total patrimony card.
  TOTAL_PATRIMONY_TITLE: "Patrimônio Total",
  TOTAL_PATRIMONY_COMPARISON: "no período selecionado",

  // Total earnings card.
  TOTAL_EARNINGS_TITLE: "Rendimento Acumulado",
  TOTAL_EARNINGS_COMPARISON: "sobre o patrimônio",

  // Portfolio count card.
  PORTFOLIO_COUNT_TITLE: "Carteiras",
  PORTFOLIO_COUNT_COMPARISON: "carteiras cadastradas",

  // Fund count card.
  FUND_COUNT_TITLE: "Fundos Custodiados",
  FUND_COUNT_COMPARISON: "fundos nas carteiras",
} as const

// Formats the delete dialog description with the name.
function FormatDeletePortfolioDescription(name: string): string {
  return (
    `Deseja excluir a carteira "${name}"? ` +
    "Esta ação não pode ser desfeita."
  )
}

// Empty state copy for the portfolio list screen.
export const PORTFOLIO_EMPTY = {
  TITLE: "Nenhuma carteira cadastrada",
  DESCRIPTION:
    "Comece cadastrando a sua primeira carteira para " +
    "acompanhar os seus investimentos.",
  PRIMARY_ACTION_LABEL: PORTFOLIO_FORM.ADD_BUTTON,
} as const

export { FormatDeletePortfolioDescription }
