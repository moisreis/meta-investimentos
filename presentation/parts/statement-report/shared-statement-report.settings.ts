/**
 * @summary
 * The hex palette of the statement PDF.
 *
 * @remarks
 * Values are hand-converted from the light theme tokens
 * of `app/globals.css`, because **react-pdf** cannot
 * resolve `oklch` variables. Each key documents the
 * shadcn/ui token it mirrors, so the document stays in
 * step with the application design system.
 *
 * The `brand*` and `chart*` keys carry the three brand
 * colors of the institutional report (green, blue and
 * purple) that the cover and the charts use.
 *
 * @explanation
 * Use this palette when wiring the **react-pdf**
 * Tailwind converter and the report document.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export const STATEMENT_REPORT_PALETTE = {
  // Token `--background`.
  background: "#ffffff",
  // Token `--foreground`.
  foreground: "#0c0c09",
  // Token `--primary`, the brand green.
  primary: "#007149",
  // Token `--primary-foreground`.
  onPrimary: "#fafafa",
  // Token `--muted`, the card surface behind blocks.
  surface: "#f4f4f0",
  // Token `--muted-foreground`, secondary text.
  subdued: "#7c7c67",
  // Token `--border`.
  border: "#e8e8e3",
  // Token `--positive`.
  positive: "#007f50",
  // Token `--negative`.
  negative: "#c2272a",
  // Brand blue, used by the comparison series.
  brandBlue: "#1d4ed8",
  // Brand purple, used by the asset-type series.
  brandPurple: "#6d28d9",
  // Amber, used by the gauge below the target.
  brandYellow: "#d97706",
  // Soft brand tint behind the cover.
  brandTint: "#eef5f1",
  // Track behind a horizontal bar.
  track: "#ecece6",
} as const

/**
 * @summary
 * The PT-BR copy of the statement PDF.
 *
 * @remarks
 * Follows the application sentence-case convention,
 * with labels as short sentence fragments.
 *
 * @explanation
 * Use these strings in the statement report document
 * so the PDF copy stays consistent with the screens.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export const STATEMENT_REPORT_COPY = {
  title: "Relatório de Investimentos",
  institution: "Meta Investimentos",
  periodLabel: "Período",
  issuedLabel: "Emissão",
  patrimonyLabel: "Patrimônio em",
  returnNote: "no mês",
  openingEntryLabel: "Saldo inicial",
  applicationsEntryLabel: "Entradas",
  withdrawalsEntryLabel: "Saídas",
  resultEntryLabel: "Resultado do período",
  positionsTitle: "Carteira de Investimentos",
  positionsEmpty: "Nenhuma posição.",
  movementsTitle: "Movimentações do Período",
  movementsEmpty: "Nenhuma movimentação no período.",
  movementTotalsTitle: "Movimentações por Fundo",
  movementTotalsEmpty: "Nenhuma movimentação no período.",
  evolutionTitle: "Evolução Patrimonial do Período",
  evolutionEmpty: "Nenhum dia com posição no período.",
  allocationTitle: "Alocação por Categoria",
  allocationEmpty: "Nenhuma alocação registrada.",
  holdingReturnsTitle: "Rentabilidade por Ativo",
  holdingReturnsEmpty: "Nenhum fundo com posição no período.",
  benchmarksTitle: "Comparativo com Índices",
  benchmarksEmpty: "Nenhum índice de comparação registrado.",
  summaryTitle: "Resumo do Período",
  fundColumn: "Fundo",
  bankColumn: "Banco",
  categoryColumn: "Categoria",
  articleColumn: "Artigo",
  weightColumn: "Peso",
  investedColumn: "Valor investido",
  patrimonyColumn: "Patrimônio",
  applicationsColumn: "Aplicações",
  withdrawalsColumn: "Resgates",
  resultColumn: "Resultado",
  returnColumn: "Retorno",
  netColumn: "Líquido",
  benchmarkColumn: "Índice",
  rateColumn: "Taxa no mês",
  carteiraLabel: "Carteira",
  metaLabel: "Meta",
  withoutCategoryLabel: "Sem categoria",
  typeColumn: "Tipo",
  dateColumn: "Data",
  amountColumn: "Valor",
  quotasColumn: "Cotas",
  typeApplication: "Aplicação",
  typeWithdrawal: "Resgate",
  footer: "Documento gerado pela plataforma.",
  pagePrefix: "Página",
  pageSeparator: "de",
  unavailable: "-",
  // Dashboard block.
  dashboardTitle: "Resumo Executivo",
  kpiMonthlyReturn: "Rentabilidade do mês",
  kpiYearlyReturn: "Rentabilidade no ano",
  kpiMonthlyGains: "Ganhos do mês",
  kpiAccumulatedGains: "Ganhos acumulados no ano",
  kpiTotalPatrimony: "Carteira total",
  gaugeTitle: "Rentabilidade em relação à meta",
  indexComparisonTitle: "Carteira em relação aos índices",
  // Performance block.
  performanceTitle: "Desempenho da Carteira",
  performanceSubtitle:
    "Comparativo mensal entre carteira e meta",
  earningsTitle: "Rendimento Mensal",
  earningsSubtitle: "Resultado mês a mês da carteira",
  totalLabel: "Total",
  // Positions block.
  positionsSubtitle:
    "Posições consolidadas no mês de referência",
  monthReturnColumn: "Rent. mês",
  yearReturnColumn: "Rent. ano",
  last12mReturnColumn: "Rent. 12m",
  earningsColumn: "Rendimento",
  movementColumn: "Movimentação",
  finalValueColumn: "Valor final",
  fundShareColumn: "% Fundo",
  // Checking accounts.
  accountsTitle: "Contas Correntes",
  accountsEmpty: "Nenhuma conta corrente registrada.",
  institutionColumn: "Instituição",
  accountColumn: "Conta",
  balanceColumn: "Saldo",
  totalLabelShort: "Total",
  // Funds and assets.
  fundsTitle: "Fundos e Ativos",
  cnpjColumn: "CNPJ",
  fundingColumn: "Enquadramento",
  administrationFeeColumn: "Taxa adm.",
  totalAssetsLabel: "Total de ativos",
  // Monthly tables.
  patrimonyMonthTitle: "Patrimônio Líquido por Mês",
  movementMonthTitle: "Movimentações por Mês",
  monthColumn: "Mês",
  // Distributions.
  distributionFundTitle: "Distribuição por Fundo",
  distributionIndexTitle:
    "Distribuição por Índice de Referência",
  distributionInstitutionTitle:
    "Distribuição por Instituição Financeira",
  // Index and asset figures.
  indexFiguresTitle: "Rendimento e Patrimônio por Índice",
  assetTypesTitle: "Ativos e Rendimento por Tipo de Ativo",
  indexColumn: "Índice",
  assetTypeColumn: "Tipo de ativo",
  // Compliance.
  complianceTitle: "Enquadramento da Carteira",
  complianceEmpty: "Nenhuma política registrada.",
  compliancePolicyColumn: "Política",
  complianceCurrentColumn: "Carteira atual",
  complianceTargetColumn: "Meta",
  complianceMaxColumn: "Máximo",
  complianceMinColumn: "Mínimo",
  complianceFlagColumn: "Enquadrado",
  yesLabel: "Sim",
  noLabel: "Não",
  // Indices.
  indexMonthsTitle: "Índices por Mês",
  accumulatedIndexesTitle: "Índices Acumulados",
  accumulatedRateColumn: "Acumulado",
  shareOfTargetColumn: "% da meta",
  portfolioLabel: "Carteira",
}
