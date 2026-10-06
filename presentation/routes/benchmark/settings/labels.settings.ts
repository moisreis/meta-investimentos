/**
 * @summary
 * Form copy for the benchmark add/edit screens.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export const BENCHMARK_FORM = {
  // Add button content.
  ADD_BUTTON: "Cadastrar Índice",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando índice",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating an index.
  CREATE_SUCCESS_TITLE: "Índice cadastrado!",

  // Success toast description after creating an index.
  CREATE_SUCCESS_DESCRIPTION:
    "O índice foi cadastrado com sucesso.",

  // Success toast title after updating an index.
  UPDATE_SUCCESS_TITLE: "Índice atualizado!",

  // Success toast description after updating an index.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the index forms.
  ERROR_TITLE: "Não foi possível salvar o índice",

  // Acronym field label.
  LABEL_ACRONYM: "Sigla",

  // Name field label.
  LABEL_NAME: "Nome",

  // Acronym field placeholder.
  PLACEHOLDER_ACRONYM: "Ex.: CDI",

  // Name field placeholder.
  PLACEHOLDER_NAME: "Ex.: Certificado de Depósito Interbancário",
} as const

// Dialog copy for the index add/edit flows.
export const BENCHMARK_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Novo índice",
  ADD_DESCRIPTION: "Preencha os dados do novo índice.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outro índice?",
  ADD_ANOTHER_DESCRIPTION:
    "O índice foi cadastrado com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outro",

  // Edit dialog header.
  EDIT_TITLE: "Editar índice",
  EDIT_DESCRIPTION: "Atualize os dados do índice.",
} as const

// Datatable copy for the benchmark list screen.
export const BENCHMARK_DATATABLE = {
  // Column headers.
  COLUMN_ACRONYM: "Sigla",
  COLUMN_NAME: "Nome",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por nome",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_EDIT_LABEL: "Editar",
} as const

// Column id to header label used by the edit-columns menu.
export const BENCHMARK_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  acronym: BENCHMARK_DATATABLE.COLUMN_ACRONYM,
  name: BENCHMARK_DATATABLE.COLUMN_NAME,
}

// KPI card copy for the index list screen.
export const BENCHMARK_KPI = {
  // Total index count card.
  BENCHMARK_COUNT_TITLE: "Índices",
  BENCHMARK_COUNT_COMPARISON: "índices cadastrados",
} as const

// Empty state copy for the index list screen.
export const BENCHMARK_EMPTY = {
  TITLE: "Nenhum índice cadastrado",
  DESCRIPTION:
    "Cadastre o primeiro índice para comparar as carteiras.",
  PRIMARY_ACTION_LABEL: BENCHMARK_FORM.ADD_BUTTON,
} as const
