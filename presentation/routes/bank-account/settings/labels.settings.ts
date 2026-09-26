// Form copy for the bank account add/edit screens.
export const BANK_ACCOUNT_FORM = {
  // Add button content.
  ADD_BUTTON: "Cadastrar Conta",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando conta",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a bank account.
  CREATE_SUCCESS_TITLE: "Conta cadastrada!",

  // Success toast description after creating a bank account.
  CREATE_SUCCESS_DESCRIPTION:
    "A conta bancária foi cadastrada com sucesso.",

  // Success toast title after updating a bank account.
  UPDATE_SUCCESS_TITLE: "Conta atualizada!",

  // Success toast description after updating a bank account.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the bank account forms.
  ERROR_TITLE: "Não foi possível salvar a conta",

  // Field labels.
  FIELD_PORTFOLIO: "Carteira",
  FIELD_BANK: "Banco",
  FIELD_AGENCY: "Agência",
  FIELD_ACCOUNT_NUMBER: "Conta",

  // Field descriptions.
  DESCRIPTION_PORTFOLIO: "Carteira que possui a conta.",
  DESCRIPTION_BANK: "Instituição financeira da conta.",
  DESCRIPTION_AGENCY: "Número da agência bancária.",
  DESCRIPTION_ACCOUNT_NUMBER: "Número da conta corrente.",

  // Select placeholders.
  PLACEHOLDER_PORTFOLIO: "Selecione a carteira",
  PLACEHOLDER_BANK: "Selecione o banco",
  PLACEHOLDER_AGENCY: "0001",
  PLACEHOLDER_ACCOUNT_NUMBER: "12345-6",

  // Registry combobox empty copy.
  SEARCH_EMPTY: "Nenhum resultado encontrado",
} as const

// Dialog copy for the bank account add/edit flows.
export const BANK_ACCOUNT_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Nova conta bancária",

  // Add dialog description.
  ADD_DESCRIPTION:
    "Vincule a conta a uma carteira e a um banco.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Cadastrar outra conta?",
  ADD_ANOTHER_DESCRIPTION:
    "A conta foi cadastrada com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Cadastrar outra",

  // Edit dialog header.
  EDIT_TITLE: "Editar conta bancária",
  EDIT_DESCRIPTION: "Atualize a agência e o número da conta.",
} as const

// Datatable copy for the bank account list screen.
export const BANK_ACCOUNT_DATATABLE = {
  // Search filter placeholder.
  FILTER_SEARCH_PLACEHOLDER:
    "Buscar por banco, carteira ou conta",

  // Portfolio column header.
  COLUMN_PORTFOLIO: "Carteira",

  // Bank column header.
  COLUMN_BANK: "Banco",

  // Agency column header.
  COLUMN_AGENCY: "Agência",

  // Account number column header.
  COLUMN_ACCOUNT_NUMBER: "Conta",

  // Checking entries count column header.
  COLUMN_CHECKING_COUNT: "Lançamentos",

  // Row actions menu label.
  ROW_ACTIONS_LABEL: "Ações",

  // Row actions edit label.
  ROW_EDIT_LABEL: "Editar",

  // Row actions delete label.
  ROW_DELETE_LABEL: "Excluir",

  // Confirm-delete dialog title.
  DELETE_TITLE: "Excluir conta bancária",

  // Confirm-delete confirm button.
  DELETE_CONFIRM_LABEL: "Excluir",

  // Confirm-delete cancel button.
  DELETE_CANCEL_LABEL: "Cancelar",

  // Success toast title after deleting a bank account.
  DELETE_SUCCESS_TITLE: "Conta excluída!",

  // Success toast description after deleting a bank account.
  DELETE_SUCCESS_DESCRIPTION:
    "A conta foi excluída com sucesso.",

  // Error toast title for the single delete flow.
  DELETE_ERROR_TITLE: "Não foi possível excluir a conta",

  // Success toast title after bulk deleting bank accounts.
  BULK_DELETE_SUCCESS_TITLE: "Contas excluídas!",

  // Success toast description after bulk deleting accounts.
  BULK_DELETE_SUCCESS_DESCRIPTION:
    "As contas selecionadas foram excluídas.",

  // Error toast title for the bulk delete flow.
  BULK_DELETE_ERROR_TITLE: "Não foi possível excluir as contas",
} as const

// KPI copy for the bank account list.
export const BANK_ACCOUNT_KPI = {
  // Total accounts KPI title.
  ACCOUNT_COUNT_TITLE: "Contas",

  // Total accounts KPI comparison.
  ACCOUNT_COUNT_COMPARISON: "contas cadastradas",

  // Portfolios KPI title.
  PORTFOLIO_COUNT_TITLE: "Carteiras",

  // Portfolios KPI comparison.
  PORTFOLIO_COUNT_COMPARISON: "carteiras vinculadas",

  // Banks KPI title.
  BANK_COUNT_TITLE: "Bancos",

  // Banks KPI comparison.
  BANK_COUNT_COMPARISON: "bancos vinculados",

  // Checking entries KPI title.
  CHECKING_COUNT_TITLE: "Lançamentos",

  // Checking entries KPI comparison.
  CHECKING_COUNT_COMPARISON: "lançamentos registrados",
} as const

// Column id to header label used by the edit-columns menu.
export const BANK_ACCOUNT_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  portfolioId: BANK_ACCOUNT_DATATABLE.COLUMN_PORTFOLIO,
  bankId: BANK_ACCOUNT_DATATABLE.COLUMN_BANK,
  agency: BANK_ACCOUNT_DATATABLE.COLUMN_AGENCY,
  accountNumber: BANK_ACCOUNT_DATATABLE.COLUMN_ACCOUNT_NUMBER,
  checkingCount: BANK_ACCOUNT_DATATABLE.COLUMN_CHECKING_COUNT,
}

// Copy used to describe the row before a single delete.
export function FormatDeleteBankAccountDescription(
  accountLabel: string
): string {
  return `Deseja excluir a conta ${accountLabel}? Esta ação não pode ser desfeita.`
}

// Empty state copy for the bank account list.
export const BANK_ACCOUNT_EMPTY = {
  TITLE: "Nenhuma conta bancária cadastrada",
  DESCRIPTION:
    "Cadastre a primeira conta para acompanhar a conta corrente.",
  PRIMARY_ACTION_LABEL: "Cadastrar conta",
} as const
