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
  // Neutral-900, the near-black axis line of the charts.
  neutral900: "#1a1a1a",
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
  positionsTitle: "Carteira de investimentos",
  positionsEmpty: "Nenhuma posição.",
  movementsTitle: "Movimentações do período",
  movementsEmpty: "Nenhuma movimentação no período.",
  movementTotalsTitle: "Movimentações por fundo",
  movementTotalsEmpty: "Nenhuma movimentação no período.",
  evolutionTitle: "Evolução patrimonial do período",
  evolutionEmpty: "Nenhum dia com posição no período.",
  allocationTitle: "Alocação por categoria",
  allocationEmpty: "Nenhuma alocação registrada.",
  holdingReturnsTitle: "Rentabilidade por ativo",
  holdingReturnsEmpty: "Nenhum fundo com posição no período.",
  benchmarksTitle: "Comparativo com índices",
  benchmarksEmpty: "Nenhum índice de comparação registrado.",
  summaryTitle: "Resumo do período",
  fundColumn: "Fundo",
  weightColumn: "Peso",
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
  footer:
    "Este material é de uso exclusivo do destinatário e não pode ser divulgado, reproduzido ou distribuído a terceiros sem autorização prévia por escrito.",
  pagePrefix: "Página",
  pageSeparator: "de",
  unavailable: "-",
  // Dashboard block.
  dashboardTitle: "Resumo executivo",
  kpiMonthlyReturn: "Rentabilidade do mês",
  kpiYearlyReturn: "Rentabilidade no ano",
  kpiMonthlyGains: "Ganhos do mês",
  kpiAccumulatedGains: "Ganhos acumulados no ano",
  kpiTotalPatrimony: "Carteira total",
  gaugeTitle: "Rentabilidade em relação à meta",
  indexComparisonTitle: "Carteira em relação aos índices",
  // Performance block.
  performanceTitle: "Desempenho da carteira",
  earningsTitle: "Rendimento mensal",
  totalLabel: "Total",
  // Positions block.
  monthReturnColumn: "Mês (%)",
  yearReturnColumn: "Ano (%)",
  earningsColumn: "Rendimento",
  movementColumn: "Movimentação",
  finalValueColumn: "Valor final",
  positionWeightColumn: "Peso (%)",
  // Checking accounts.
  accountsTitle: "Contas correntes",
  accountsEmpty: "Nenhuma conta corrente registrada.",
  institutionColumn: "Instituição",
  accountColumn: "Conta",
  balanceColumn: "Saldo",
  accountWeightColumn: "Peso (%)",
  totalLabelShort: "Total",
  // Funds and assets.
  fundsTitle: "Relação dos fundos e ativos",
  cnpjColumn: "CNPJ",
  fundingColumn: "Enq. 5.722/25",
  administrationFeeColumn: "Taxa (%)",
  // Monthly tables.
  patrimonyMonthTitle: "Patrimônio total por mês",
  movementMonthTitle: "Movimentações por mês",
  monthColumn: "Mês",
  // Distributions.
  distributionFundTitle: "Distribuição por fundos",
  distributionIndexTitle:
    "Distribuição por índice de referência",
  distributionInstitutionTitle:
    "Distribuição por instituição financeira",
  // Index and asset figures.
  indexFiguresTitle: "Rendimento e patrimônio por índice",
  indexEarningsBarsTitle: "Rendimento por índice de referência",
  indexPatrimonyBarsTitle: "Patrimônio por índice de referência",
  categoryEarningsBarsTitle: "Rendimento por categoria",
  categoryPatrimonyBarsTitle: "Patrimônio por categoria",
  assetTypesTitle: "Ativos e rendimento por tipo de ativo",
  indexColumn: "Índice",
  assetTypeColumn: "Tipo de ativo",
  // Compliance.
  complianceTitle: "Enquadramento da carteira",
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
  indexMonthsTitle: "Índices por mês",
  accumulatedIndexesTitle: "Índices acumulados",
  accumulatedRateColumn: "Acumulado",
  portfolioLabel: "Carteira",
}
