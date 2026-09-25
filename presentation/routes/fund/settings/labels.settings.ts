// Form copy for the fund add/edit screens.
export const FUND_FORM = {
  // Add button content.
  ADD_BUTTON: "Cadastrar Fundo",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando fundo",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a fund.
  CREATE_SUCCESS_TITLE: "Fundo cadastrado!",

  // Success toast description after creating a fund.
  CREATE_SUCCESS_DESCRIPTION:
    "O fundo foi cadastrado com sucesso.",

  // Success toast title after updating a fund.
  UPDATE_SUCCESS_TITLE: "Fundo atualizado!",

  // Success toast description after updating a fund.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the fund forms.
  ERROR_TITLE: "Não foi possível salvar o fundo",

  // Field labels.
  FIELD_CNPJ: "CNPJ",
  FIELD_NAME: "Nome",
  FIELD_ADMINISTRATION_FEE: "Taxa de administração",
  FIELD_PERFORMANCE_FEE: "Taxa de performance",
  FIELD_BANK: "Banco",
  FIELD_BENCHMARK: "Benchmark",
  FIELD_CATEGORY: "Categoria",

  // Field descriptions.
  DESCRIPTION_ADMINISTRATION_FEE: "Em percentual ao ano.",
  DESCRIPTION_PERFORMANCE_FEE: "Em percentual ao ano.",

  // Select placeholders.
  PLACEHOLDER_BANK: "Selecione o banco",
  PLACEHOLDER_BENCHMARK: "Sem benchmark",
  PLACEHOLDER_CATEGORY: "Sem categoria",
} as const

// Dialog copy for the fund add/edit flows.
export const FUND_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Novo fundo",
  ADD_DESCRIPTION: "Preencha os dados do novo fundo.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outro fundo?",
  ADD_ANOTHER_DESCRIPTION:
    "O fundo foi cadastrado com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outro",

  // Edit dialog header.
  EDIT_TITLE: "Editar fundo",
  EDIT_DESCRIPTION: "Atualize os dados do fundo.",
} as const

// Datatable copy for the fund list screen.
export const FUND_DATATABLE = {
  // Column headers.
  COLUMN_CNPJ: "CNPJ",
  COLUMN_NAME: "Nome",
  COLUMN_POSITION_COUNT: "Nº de Posições",
  COLUMN_ADMINISTRATION_FEE: "Taxa Adm.",
  COLUMN_PERFORMANCE_FEE: "Taxa Perf.",
  COLUMN_BANK: "Banco",
  COLUMN_BENCHMARK: "Benchmark",
  COLUMN_CATEGORY: "Categoria",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por nome ou CNPJ",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_EDIT_LABEL: "Editar",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir fundo",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Fundo excluído!",
  DELETE_SUCCESS_DESCRIPTION:
    "O fundo foi excluído com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir o fundo",

  // Bulk delete result toast copy.
  BULK_DELETE_SUCCESS_TITLE: "Fundos excluídos!",
  BULK_DELETE_SUCCESS_DESCRIPTION:
    "Os fundos selecionados foram excluídos.",
  BULK_DELETE_ERROR_TITLE: "Não foi possível excluir os fundos",
} as const

// Column id to header label used by the edit-columns menu.
export const FUND_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  cnpj: FUND_DATATABLE.COLUMN_CNPJ,
  name: FUND_DATATABLE.COLUMN_NAME,
  positionCount: FUND_DATATABLE.COLUMN_POSITION_COUNT,
  administrationFee: FUND_DATATABLE.COLUMN_ADMINISTRATION_FEE,
  performanceFee: FUND_DATATABLE.COLUMN_PERFORMANCE_FEE,
  bankId: FUND_DATATABLE.COLUMN_BANK,
  benchmarkId: FUND_DATATABLE.COLUMN_BENCHMARK,
  categoryId: FUND_DATATABLE.COLUMN_CATEGORY,
}

// KPI card copy for the fund list screen.
export const FUND_KPI = {
  // Total fund count card.
  FUND_COUNT_TITLE: "Fundos",
  FUND_COUNT_COMPARISON: "fundos cadastrados",

  // Total linked position count card.
  POSITION_COUNT_TITLE: "Posições Vinculadas",
  POSITION_COUNT_COMPARISON: "posições nos fundos",

  // Funds with at least one position card.
  FUNDS_WITH_POSITIONS_TITLE: "Fundos com Posições",
  FUNDS_WITH_POSITIONS_COMPARISON: "fundos com posições",

  // Funds without any position card.
  FUNDS_WITHOUT_POSITIONS_TITLE: "Fundos sem Posições",
  FUNDS_WITHOUT_POSITIONS_COMPARISON: "fundos sem posições",
} as const

// Formats the delete dialog description with the name.
function FormatDeleteFundDescription(name: string): string {
  return (
    `Deseja excluir o fundo "${name}"? ` +
    "Esta ação não pode ser desfeita."
  )
}

// Empty state copy for the fund list screen.
export const FUND_EMPTY = {
  TITLE: "Nenhum fundo cadastrado",
  DESCRIPTION:
    "Cadastre o primeiro fundo para montar as suas carteiras.",
  PRIMARY_ACTION_LABEL: FUND_FORM.ADD_BUTTON,
} as const

export { FormatDeleteFundDescription }
