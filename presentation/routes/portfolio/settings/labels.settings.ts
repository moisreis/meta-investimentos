/**
 * @summary
 * Form copy for the portfolio add/edit screens.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
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

// KPI and filter copy for the portfolio detail screen.
export const PORTFOLIO_OVERVIEW = {
  // KPI card titles.
  KPI_PATRIMONY_TITLE: "Patrimônio da Carteira",
  KPI_YEAR_GAIN_TITLE: "Ganho Acumulado no Ano",
  KPI_MONTH_GAIN_TITLE: "Ganhos do Mês",
  KPI_YEAR_RETURN_TITLE: "Rendimento Acumulado do Ano",
  KPI_MONTH_RETURN_TITLE: "Rendimento do Mês",

  // Comparison prefixes.
  COMPARISON_VS: "vs.",
  COMPARISON_SINCE: "desde",
  COMPARISON_YEAR: "no ano de",
  COMPARISON_MONTH: "em",

  // Toolbar filter copy.
  FILTER_DATE_PLACEHOLDER:
    PORTFOLIO_DATATABLE.FILTER_DATE_RANGE_PLACEHOLDER,

  // Empty state copy for the detail screen.
  EMPTY_TITLE: "Sem desempenho calculado",
  EMPTY_DESCRIPTION:
    "Os indicadores da carteira aparecem após o " +
    "cálculo do desempenho.",
} as const

// Chart copy for the portfolio detail screen.
export const PORTFOLIO_CHARTS = {
  // Patrimony chart.
  PATRIMONY_TITLE: "Evolução do Patrimônio",
  PATRIMONY_DESCRIPTION:
    "Valor da carteira ao fim de cada dia do período.",
  PATRIMONY_SERIES: "Patrimônio",
  PATRIMONY_REFERENCE: "Valor no início do período",

  // Return chart.
  RETURN_TITLE: "Rentabilidade",
  RETURN_DESCRIPTION:
    "Retorno de cada dia e rentabilidade acumulada no mês e no ano.",
  RETURN_SERIES_DAILY: "Retorno diário",
  RETURN_SERIES_MONTHLY: "Retorno no mês",
  RETURN_SERIES_YEARLY: "Retorno no ano",

  // Daily result chart.
  RESULT_TITLE: "Resultado Diário",
  RESULT_DESCRIPTION:
    "Ganho de mercado de cada dia, frente ao valor da carteira.",
  RESULT_SERIES_EARNINGS: "Ganho de mercado",

  // Cash movement chart.
  MOVEMENT_TITLE: "Entradas e Saídas",
  MOVEMENT_DESCRIPTION:
    "Aplicações e resgates líquidos de cada dia do período.",
  MOVEMENT_SERIES_CASH_FLOW: "Fluxo líquido",
} as const

// Chart copy for the by-position and by-bank distributions
// of the portfolio detail screen.
export const PORTFOLIO_DISTRIBUTION = {
  // Series shared by both rings.
  SERIES_INVESTED: "Investido",

  // By-position distribution.
  POSITION_TITLE: "Distribuição por Fundo",
  POSITION_DESCRIPTION:
    "Proporção do valor investido em cada fundo da carteira.",
  POSITION_CENTER: "Investido",

  // By-bank distribution.
  BANK_TITLE: "Distribuição por Banco",
  BANK_DESCRIPTION:
    "Proporção do valor investido em cada banco custodiente.",
  BANK_CENTER: "Investido",
} as const

// Datatable copy for the recent activity section of the
// portfolio detail screen.
export const PORTFOLIO_ACTIVITY = {
  // Section title.
  TITLE: "Movimentações do Período",
  // Section description.
  DESCRIPTION:
    "Aplicações e resgates da carteira no período selecionado.",

  // Column headers.
  COLUMN_TYPE: "Tipo",
  COLUMN_DATE: "Data",
  COLUMN_FUND: "Fundo",
  COLUMN_AMOUNT: "Valor",
  COLUMN_QUOTAS: "Cotas",

  // Type badges.
  TYPE_APPLICATION: "Aplicação",
  TYPE_WITHDRAWAL: "Resgate",

  // Empty state of the section.
  EMPTY_TITLE: "Nenhuma movimentação no período",
  EMPTY_DESCRIPTION:
    "As aplicações e os resgates da carteira aparecem aqui " +
    "assim que houver um lançamento no período selecionado.",
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

// Section copy of the portfolio detail charts.
export const PORTFOLIO_CHART_SECTIONS = {
  // Windowed performance section.
  PERFORMANCE_TITLE: "Desempenho no período",
  PERFORMANCE_DESCRIPTION:
    "Evolução do patrimônio, do resultado e dos movimentos " +
    "dentro do período selecionado.",

  // Holdings distribution section.
  DISTRIBUTIONS_TITLE: "Distribuições",
  DISTRIBUTIONS_DESCRIPTION:
    "Como o valor investido está dividido entre os fundos e " +
    "os bancos custodiantes da carteira.",

  // Checking account section.
  CHECKING_TITLE: "Conta corrente",
  CHECKING_DESCRIPTION:
    "Saldos em conta corrente do período e a divisão atual " +
    "entre as contas da carteira.",

  // Annual monthly history section.
  ANNUAL_TITLE: "Análise do ano",
  ANNUAL_DESCRIPTION:
    "Rendimentos, patrimônio e retorno mês a mês do ano " +
    "corrente, independentes do período selecionado.",
} as const

// Chart copy for the checking accounts of the portfolio
// detail screen.
export const PORTFOLIO_CHECKING = {
  // Series shared by the evolution and the distribution.
  SERIES_BALANCE: "Saldo",

  // Balance evolution chart.
  EVOLUTION_TITLE: "Evolução do Saldo",
  EVOLUTION_DESCRIPTION:
    "Soma dos saldos em conta corrente de cada dia do período.",

  // Balance distribution chart.
  DISTRIBUTION_TITLE: "Distribuição do Saldo",
  DISTRIBUTION_DESCRIPTION:
    "Saldo atual de cada conta corrente da carteira.",
  DISTRIBUTION_CENTER: "Saldo",
} as const

// Chart copy for the annual monthly history of the portfolio
// detail screen.
export const PORTFOLIO_ANNUAL = {
  // Monthly earnings chart.
  EARNINGS_TITLE: "Rendimento Mensal",
  EARNINGS_DESCRIPTION:
    "Soma dos rendimentos de mercado de cada mês do ano.",
  EARNINGS_SERIES: "Rendimento",

  // Monthly patrimony chart.
  PATRIMONY_TITLE: "Patrimônio Mensal",
  PATRIMONY_DESCRIPTION:
    "Patrimônio da carteira ao fim de cada mês do ano.",
  PATRIMONY_SERIES: "Patrimônio",

  // Monthly return chart.
  RETURN_TITLE: "Retorno Mensal",
  RETURN_DESCRIPTION:
    "Retorno acumulado de cada mês do ano.",
  RETURN_SERIES: "Retorno no mês",
} as const

// Datatable copy for the positions section of the portfolio
// detail screen.
export const PORTFOLIO_POSITIONS = {
  // Section title.
  TITLE: "Posições da Carteira",
  // Section description.
  DESCRIPTION:
    "Fundos que compõem a carteira, com o banco custodiente, " +
    "o peso e o valor investido.",

  // Column headers.
  COLUMN_FUND: "Fundo",
  COLUMN_BANK: "Banco",
  COLUMN_WEIGHT: "Peso",
  COLUMN_INVESTED: "Valor Investido",

  // Empty state of the section.
  EMPTY_TITLE: "Nenhuma posição",
  EMPTY_DESCRIPTION:
    "As posições da carteira aparecem aqui assim que houver " +
    "um fundo aplicado.",
} as const

export { FormatDeletePortfolioDescription }

