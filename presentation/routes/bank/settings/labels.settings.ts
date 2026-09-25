// Form copy for the bank add/edit screens.
export const BANK_FORM = {
  // Add button content.
  ADD_BUTTON: "Cadastrar Banco",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando banco",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a bank.
  CREATE_SUCCESS_TITLE: "Banco cadastrado!",

  // Success toast description after creating a bank.
  CREATE_SUCCESS_DESCRIPTION:
    "O banco foi cadastrado com sucesso.",

  // Success toast title after updating a bank.
  UPDATE_SUCCESS_TITLE: "Banco atualizado!",

  // Success toast description after updating a bank.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the bank forms.
  ERROR_TITLE: "Não foi possível salvar o banco",
} as const

// Dialog copy for the bank add/edit flows.
export const BANK_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Novo banco",
  ADD_DESCRIPTION: "Preencha os dados do novo banco.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outro banco?",
  ADD_ANOTHER_DESCRIPTION:
    "O banco foi cadastrado com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outro",

  // Edit dialog header.
  EDIT_TITLE: "Editar banco",
  EDIT_DESCRIPTION: "Atualize os dados do banco.",
} as const

// Datatable copy for the bank list screen.
export const BANK_DATATABLE = {
  // Column headers.
  COLUMN_CODE: "Código",
  COLUMN_NAME: "Nome",
  COLUMN_ACCOUNT_COUNT: "Nº de Contas",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por nome",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_EDIT_LABEL: "Editar",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir banco",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Banco excluído!",
  DELETE_SUCCESS_DESCRIPTION:
    "O banco foi excluído com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir o banco",

  // Bulk delete result toast copy.
  BULK_DELETE_SUCCESS_TITLE: "Bancos excluídos!",
  BULK_DELETE_SUCCESS_DESCRIPTION:
    "Os bancos selecionados foram excluídos.",
  BULK_DELETE_ERROR_TITLE: "Não foi possível excluir os bancos",
} as const

// Column id to header label used by the edit-columns menu.
export const BANK_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  code: BANK_DATATABLE.COLUMN_CODE,
  name: BANK_DATATABLE.COLUMN_NAME,
  accountCount: BANK_DATATABLE.COLUMN_ACCOUNT_COUNT,
}

// KPI card copy for the bank list screen.
export const BANK_KPI = {
  // Total bank count card.
  BANK_COUNT_TITLE: "Bancos",
  BANK_COUNT_COMPARISON: "bancos cadastrados",

  // Total linked account count card.
  ACCOUNT_COUNT_TITLE: "Contas Vinculadas",
  ACCOUNT_COUNT_COMPARISON: "contas nos bancos",

  // Banks with at least one account card.
  BANKS_WITH_ACCOUNTS_TITLE: "Bancos com Contas",
  BANKS_WITH_ACCOUNTS_COMPARISON: "bancos com contas",

  // Banks without any account card.
  BANKS_WITHOUT_ACCOUNTS_TITLE: "Bancos sem Contas",
  BANKS_WITHOUT_ACCOUNTS_COMPARISON: "bancos sem contas",
} as const

// Formats the delete dialog description with the name.
function FormatDeleteBankDescription(name: string): string {
  return (
    `Deseja excluir o banco "${name}"? ` +
    "Esta ação não pode ser desfeita."
  )
}

// Empty state copy for the bank list screen.
export const BANK_EMPTY = {
  TITLE: "Nenhum banco cadastrado",
  DESCRIPTION:
    "Cadastre o primeiro banco para vincular contas às carteiras.",
  PRIMARY_ACTION_LABEL: BANK_FORM.ADD_BUTTON,
} as const

export { FormatDeleteBankDescription }
