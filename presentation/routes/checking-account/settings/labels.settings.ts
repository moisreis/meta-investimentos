// Form copy for the checking account add/edit screens.
export const CHECKING_ACCOUNT_FORM = {
  // Add button content.
  ADD_BUTTON: "Cadastrar Saldo",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando saldo",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a balance.
  CREATE_SUCCESS_TITLE: "Saldo cadastrado!",

  // Success toast description after creating a balance.
  CREATE_SUCCESS_DESCRIPTION:
    "O saldo diário foi cadastrado com sucesso.",

  // Success toast title after updating a balance.
  UPDATE_SUCCESS_TITLE: "Saldo atualizado!",

  // Success toast description after updating a balance.
  UPDATE_SUCCESS_DESCRIPTION: "O saldo foi atualizado.",

  // Error toast title for the checking account forms.
  ERROR_TITLE: "Não foi possível salvar o saldo",

  // Field labels.
  FIELD_BANK_ACCOUNT: "Conta bancária",
  FIELD_DATE: "Data",
  FIELD_VALUE: "Saldo",

  // Field descriptions.
  DESCRIPTION_BANK_ACCOUNT: "Agência e conta vinculadas.",
  DESCRIPTION_VALUE: "Valor do saldo ao fim do dia.",

  // Select placeholders.
  PLACEHOLDER_BANK_ACCOUNT: "Selecione a conta bancária",
  PLACEHOLDER_DATE: "Selecione a data",
  PLACEHOLDER_VALUE: "0,00",

  // Registry combobox empty copy.
  SEARCH_EMPTY: "Nenhum resultado encontrado",
} as const

// Dialog copy for the checking account add/edit flows.
export const CHECKING_ACCOUNT_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Novo saldo",

  // Add dialog description.
  ADD_DESCRIPTION: "Registre o saldo diário da conta bancária.",

  // Add-another dialog header.
  ADD_ANOTHER_TITLE: "Cadastrar outro saldo?",

  // Add-another dialog description.
  ADD_ANOTHER_DESCRIPTION:
    "O saldo foi cadastrado com sucesso. O que deseja fazer?",

  // Add-another back-to-table button.
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",

  // Add-another secondary button.
  ADD_ANOTHER_ANOTHER_LABEL: "Cadastrar outro",

  // Edit dialog header.
  EDIT_TITLE: "Editar saldo",

  // Edit dialog description.
  EDIT_DESCRIPTION: "Atualize o valor do saldo.",
} as const

// Datatable copy for the checking account list.
export const CHECKING_ACCOUNT_DATATABLE = {
  // Search filter placeholder.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por conta ou data",

  // Bank account column header.
  COLUMN_BANK_ACCOUNT: "Conta Bancária",

  // Date column header.
  COLUMN_DATE: "Data",

  // Value column header.
  COLUMN_VALUE: "Saldo",

  // Row actions menu label.
  ROW_ACTIONS_LABEL: "Ações",

  // Row actions edit label.
  ROW_EDIT_LABEL: "Editar",

  // Row actions delete label.
  ROW_DELETE_LABEL: "Excluir",

  // Confirm-delete dialog title.
  DELETE_TITLE: "Excluir saldo",

  // Confirm-delete confirm button.
  DELETE_CONFIRM_LABEL: "Excluir",

  // Confirm-delete cancel button.
  DELETE_CANCEL_LABEL: "Cancelar",

  // Success toast title after deleting a balance.
  DELETE_SUCCESS_TITLE: "Saldo excluído!",

  // Success toast description after deleting a balance.
  DELETE_SUCCESS_DESCRIPTION:
    "O saldo foi excluído com sucesso.",

  // Error toast title for the single delete flow.
  DELETE_ERROR_TITLE: "Não foi possível excluir o saldo",

  // Success toast title after bulk deleting balances.
  BULK_DELETE_SUCCESS_TITLE: "Saldos excluídos!",

  // Success toast description after bulk deleting balances.
  BULK_DELETE_SUCCESS_DESCRIPTION:
    "Os saldos selecionados foram excluídos.",

  // Error toast title for the bulk delete flow.
  BULK_DELETE_ERROR_TITLE: "Não foi possível excluir os saldos",
} as const

// KPI copy for the checking account list.
export const CHECKING_ACCOUNT_KPI = {
  // Total entries KPI title.
  ENTRY_COUNT_TITLE: "Registros",

  // Total entries KPI comparison.
  ENTRY_COUNT_COMPARISON: "saldos registrados",

  // Bank accounts KPI title.
  ACCOUNT_COUNT_TITLE: "Contas",

  // Bank accounts KPI comparison.
  ACCOUNT_COUNT_COMPARISON: "contas com saldo",

  // Positive balances KPI title.
  POSITIVE_COUNT_TITLE: "Saldos Positivos",

  // Positive balances KPI comparison.
  POSITIVE_COUNT_COMPARISON: "saldos positivos",

  // Negative balances KPI title.
  NEGATIVE_COUNT_TITLE: "Saldos Negativos",

  // Negative balances KPI comparison.
  NEGATIVE_COUNT_COMPARISON: "saldos negativos",
} as const

// Column id to header label used by the edit-columns menu.
export const CHECKING_ACCOUNT_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  bankAccountId: CHECKING_ACCOUNT_DATATABLE.COLUMN_BANK_ACCOUNT,
  date: CHECKING_ACCOUNT_DATATABLE.COLUMN_DATE,
  value: CHECKING_ACCOUNT_DATATABLE.COLUMN_VALUE,
}

// Copy used to describe the row before a single delete.
export function FormatDeleteCheckingAccountDescription(
  accountLabel: string,
  dateLabel: string
): string {
  return `Deseja excluir o saldo de ${accountLabel} referente a ${dateLabel}? Esta ação não pode ser desfeita.`
}

// Empty state copy for the checking account list.
export const CHECKING_ACCOUNT_EMPTY = {
  TITLE: "Nenhum saldo registrado",
  DESCRIPTION:
    "Cadastre o primeiro saldo diário para acompanhar a conta corrente.",
  PRIMARY_ACTION_LABEL: "Cadastrar saldo",
} as const
