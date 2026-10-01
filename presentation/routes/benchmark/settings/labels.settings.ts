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
  ADD_BUTTON: "Cadastrar Benchmark",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando benchmark",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a benchmark.
  CREATE_SUCCESS_TITLE: "Benchmark cadastrado!",

  // Success toast description after creating a benchmark.
  CREATE_SUCCESS_DESCRIPTION:
    "O benchmark foi cadastrado com sucesso.",

  // Success toast title after updating a benchmark.
  UPDATE_SUCCESS_TITLE: "Benchmark atualizado!",

  // Success toast description after updating a benchmark.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the benchmark forms.
  ERROR_TITLE: "Não foi possível salvar o benchmark",

  // Acronym field label.
  LABEL_ACRONYM: "Sigla",

  // Name field label.
  LABEL_NAME: "Nome",

  // Acronym field placeholder.
  PLACEHOLDER_ACRONYM: "Ex.: CDI",

  // Name field placeholder.
  PLACEHOLDER_NAME: "Ex.: Certificado de Depósito Interbancário",
} as const

// Dialog copy for the benchmark add/edit flows.
export const BENCHMARK_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Novo benchmark",
  ADD_DESCRIPTION: "Preencha os dados do novo benchmark.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outro benchmark?",
  ADD_ANOTHER_DESCRIPTION:
    "O benchmark foi cadastrado com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outro",

  // Edit dialog header.
  EDIT_TITLE: "Editar benchmark",
  EDIT_DESCRIPTION: "Atualize os dados do benchmark.",
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

// KPI card copy for the benchmark list screen.
export const BENCHMARK_KPI = {
  // Total benchmark count card.
  BENCHMARK_COUNT_TITLE: "Benchmarks",
  BENCHMARK_COUNT_COMPARISON: "benchmarks cadastrados",
} as const

// Empty state copy for the benchmark list screen.
export const BENCHMARK_EMPTY = {
  TITLE: "Nenhum benchmark cadastrado",
  DESCRIPTION:
    "Cadastre o primeiro benchmark para comparar as carteiras.",
  PRIMARY_ACTION_LABEL: BENCHMARK_FORM.ADD_BUTTON,
} as const
