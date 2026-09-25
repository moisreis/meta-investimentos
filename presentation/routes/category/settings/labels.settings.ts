// Form copy for the category add/edit screens.
export const CATEGORY_FORM = {
  // Add button content.
  ADD_BUTTON: "Cadastrar Categoria",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando categoria",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a category.
  CREATE_SUCCESS_TITLE: "Categoria cadastrada!",

  // Success toast description after creating a category.
  CREATE_SUCCESS_DESCRIPTION:
    "A categoria foi cadastrada com sucesso.",

  // Success toast title after updating a category.
  UPDATE_SUCCESS_TITLE: "Categoria atualizada!",

  // Success toast description after updating a category.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the category forms.
  ERROR_TITLE: "Não foi possível salvar a categoria",

  // Field labels.
  FIELD_NAME: "Nome",

  // Input placeholders.
  PLACEHOLDER_NAME: "Ex.: Renda Fixa",
} as const

// Dialog copy for the category add/edit flows.
export const CATEGORY_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Nova categoria",
  ADD_DESCRIPTION: "Preencha o nome da nova categoria.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outra categoria?",
  ADD_ANOTHER_DESCRIPTION:
    "A categoria foi cadastrada com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outra",

  // Edit dialog header.
  EDIT_TITLE: "Editar categoria",
  EDIT_DESCRIPTION: "Atualize o nome da categoria.",
} as const

// Datatable copy for the category list screen.
export const CATEGORY_DATATABLE = {
  // Column headers.
  COLUMN_NAME: "Nome",
  COLUMN_FUND_COUNT: "Nº de Fundos",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por nome",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_EDIT_LABEL: "Editar",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir categoria",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Categoria excluída!",
  DELETE_SUCCESS_DESCRIPTION:
    "A categoria foi excluída com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir a categoria",

  // Bulk delete result toast copy.
  BULK_DELETE_SUCCESS_TITLE: "Categorias excluídas!",
  BULK_DELETE_SUCCESS_DESCRIPTION:
    "As categorias selecionadas foram excluídas.",
  BULK_DELETE_ERROR_TITLE:
    "Não foi possível excluir as categorias",
} as const

// Column id to header label used by the edit-columns menu.
export const CATEGORY_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  name: CATEGORY_DATATABLE.COLUMN_NAME,
  fundCount: CATEGORY_DATATABLE.COLUMN_FUND_COUNT,
}

// KPI card copy for the category list screen.
export const CATEGORY_KPI = {
  // Total category count card.
  CATEGORY_COUNT_TITLE: "Categorias",
  CATEGORY_COUNT_COMPARISON: "categorias cadastradas",

  // Total linked fund count card.
  FUND_COUNT_TITLE: "Fundos Vinculados",
  FUND_COUNT_COMPARISON: "fundos nas categorias",

  // Categories with at least one fund card.
  CATEGORIES_WITH_FUNDS_TITLE: "Categorias com Fundos",
  CATEGORIES_WITH_FUNDS_COMPARISON: "categorias com fundos",

  // Categories without any fund card.
  CATEGORIES_WITHOUT_FUNDS_TITLE: "Categorias sem Fundos",
  CATEGORIES_WITHOUT_FUNDS_COMPARISON: "categorias sem fundos",
} as const

// Formats the delete dialog description with the name.
function FormatDeleteCategoryDescription(name: string): string {
  return (
    `Deseja excluir a categoria "${name}"? ` +
    "Esta ação não pode ser desfeita."
  )
}

// Empty state copy for the category list screen.
export const CATEGORY_EMPTY = {
  TITLE: "Nenhuma categoria cadastrada",
  DESCRIPTION:
    "Cadastre a primeira categoria para classificar os fundos das carteiras.",
  PRIMARY_ACTION_LABEL: CATEGORY_FORM.ADD_BUTTON,
} as const

export { FormatDeleteCategoryDescription }
