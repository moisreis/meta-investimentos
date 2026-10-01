/**
 * @summary
 * Copy for the norm screens.
 *
 * @remarks
 * Keeps the field labels, the placeholders, the toasts
 * and the datatable headers out of the components, so
 * a route file never hard-codes a string the checker
 * would reject.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */

// Form copy for the norm add/edit screens.
export const NORM_FORM = {
  // Add button content.
  ADD_BUTTON: "Cadastrar Norma",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando norma",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a norm.
  CREATE_SUCCESS_TITLE: "Norma cadastrada!",

  // Success toast description after creating a norm.
  CREATE_SUCCESS_DESCRIPTION:
    "A norma foi cadastrada com sucesso.",

  // Success toast title after updating a norm.
  UPDATE_SUCCESS_TITLE: "Norma atualizada!",

  // Success toast description after updating a norm.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the norm forms.
  ERROR_TITLE: "Não foi possível salvar a norma",

  // Article field label.
  LABEL_ARTICLE: "Artigo",

  // Name field label.
  LABEL_NAME: "Nome",

  // Category field label.
  LABEL_CATEGORY: "Categoria",

  // Minimum allocation field label.
  LABEL_MIN_ALLOCATION: "Alocação mínima",

  // Target allocation field label.
  LABEL_TARGET_ALLOCATION: "Alocação alvo",

  // Maximum allocation field label.
  LABEL_MAX_ALLOCATION: "Alocação máxima",

  // Article field placeholder.
  PLACEHOLDER_ARTICLE: "Ex.: Art. 1º",

  // Name field placeholder.
  PLACEHOLDER_NAME: "Ex.: Renda variável",

  // Category field placeholder.
  PLACEHOLDER_CATEGORY: "Selecione a categoria",

  // Combobox empty result copy.
  SEARCH_EMPTY: "Nenhuma categoria encontrada",
} as const

// Dialog copy for the norm add/edit flows.
export const NORM_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Nova norma",
  ADD_DESCRIPTION: "Preencha os dados da nova norma.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outra norma?",
  ADD_ANOTHER_DESCRIPTION:
    "A norma foi cadastrada com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outra",

  // Edit dialog header.
  EDIT_TITLE: "Editar norma",
  EDIT_DESCRIPTION: "Atualize os dados da norma.",
} as const

// Datatable copy for the norm list screen.
export const NORM_DATATABLE = {
  // Column headers.
  COLUMN_ARTICLE: "Artigo",
  COLUMN_NAME: "Nome",
  COLUMN_CATEGORY: "Categoria",
  COLUMN_MIN_ALLOCATION: "Mínimo",
  COLUMN_TARGET_ALLOCATION: "Alvo",
  COLUMN_MAX_ALLOCATION: "Máximo",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por nome",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_EDIT_LABEL: "Editar",
} as const

// Column id to header label used by the edit-columns menu.
export const NORM_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  articleNumber: NORM_DATATABLE.COLUMN_ARTICLE,
  name: NORM_DATATABLE.COLUMN_NAME,
  category: NORM_DATATABLE.COLUMN_CATEGORY,
  minAllocation: NORM_DATATABLE.COLUMN_MIN_ALLOCATION,
  targetAllocation: NORM_DATATABLE.COLUMN_TARGET_ALLOCATION,
  maxAllocation: NORM_DATATABLE.COLUMN_MAX_ALLOCATION,
}

// KPI card copy for the norm list screen.
export const NORM_KPI = {
  // Total norm count card.
  NORM_COUNT_TITLE: "Normas",
  NORM_COUNT_COMPARISON: "normas cadastradas",

  // Distinct category count card.
  CATEGORY_COUNT_TITLE: "Categorias",
  CATEGORY_COUNT_COMPARISON: "categorias com normas",

  // Mean target allocation card.
  AVERAGE_TARGET_TITLE: "Alvo médio",
  AVERAGE_TARGET_COMPARISON: "média das alocações alvo",
} as const

// Empty state copy for the norm list screen.
export const NORM_EMPTY = {
  TITLE: "Nenhuma norma cadastrada",
  DESCRIPTION:
    "Cadastre a primeira norma para orientar as alocações.",
  PRIMARY_ACTION_LABEL: NORM_FORM.ADD_BUTTON,
} as const
