import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * @summary
 * A single fund position row of the monthly statement,
 * already resolved by the shared holding mapper of the
 * extrato.
 *
 * @remarks
 * Mirrors the extrato positions datatable: the fund, the
 * custodian bank with its code, the category and the norm
 * article the fund is enquadred under (when the fund
 * registry links them), the share of the portfolio the
 * position holds and the money invested through it.
 */
export interface StatementReportPositionRow {
  fundName: string
  bankName: string
  bankCode: string
  // Category name the fund belongs to, or `null` when
  // the fund registry links none.
  categoryName: string | null
  // Norm article number enquadring that category, or
  // `null` when no norm registers the category.
  articleNumber: string | null
  weight: string
  investedValue: string
  // Market gain of the position inside the reference month,
  // as a signed amount, or `null` when it holds no snapshot.
  earnings: string | null
  // Net money moved through the position inside the
  // reference month, as a signed amount.
  movement: string | null
  // Closing value of the position in the reference month,
  // or `null` when it holds no snapshot.
  finalValue: string | null
  // Chained return of the position in the reference month.
  returnMonthly: string | null
  // Chained return of the position in the reference year.
  returnYearly: string | null
  // Chained trailing return of the position in the last
  // twelve months.
  returnLast12m: string | null
  // Share of the fund's total net assets the position
  // holds. Always `null` while the fund registry carries no
  // net asset figure.
  fundShare: string | null
}

/**
 * @summary
 * The identification data stamped on the report cover.
 *
 * @remarks
 * Carries the portfolio and the period the file answers
 * for. The institution and the document title are copy,
 * so they live in the document settings and never here.
 */
export interface StatementReportCover {
  portfolioName: string
  portfolioAcronym: string
  periodLabel: string
  periodStart: string
  periodEnd: string
  issuedAt: string
}

/**
 * @summary
 * One trading day of the month window.
 *
 * @remarks
 * Carries the closing patrimony of the day, the money
 * that entered and left it, the result and the daily
 * return, all projected from the performance snapshot
 * of that day.
 */
/**
 * @summary
 * The report model rendered by the statement PDF.
 *
 * @remarks
 * Carries display-ready values: dates and amounts stay
 * raw strings, and derived labels and figures are
 * computed once by the report mapper through the shared
 * period calculators and formatted by the document.
 * Amounts are decimal strings so float drift never
 * enters the pipeline.
 *
 * @explanation
 * Use this model to render the monthly statement
 * document with **react-pdf**. It is the single
 * contract between the report mapper and the PDF view.
 *
 * @example
 * const DATA = BuildStatementReportData(SOURCE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export interface StatementReportData {
  portfolio: PortfolioResponseDTO
  month: string
  periodStart: string
  periodEnd: string
  // The `MMMM de yyyy` label of the month.
  periodLabel: string
  // The UTC instant the file was rendered at.
  issuedAt: string
  // The identification data stamped on the cover.
  cover: StatementReportCover
  // The holdings of the portfolio, newest position first.
  positions: StatementReportPositionRow[]
  // The dashboard KPI block of the report.
  kpis: StatementReportKpis
  // The month-by-month return against the target.
  performance: StatementReportPerformancePoint[]
  // The month-by-month earnings of the portfolio.
  monthlyEarnings: StatementReportEarningsPoint[]
  // The month-by-month closing patrimony.
  patrimonyMonths: StatementReportPatrimonyPoint[]
  // The month-by-month applications, redemptions and net.
  movementMonths: StatementReportMovementPoint[]
  // The checking account balances of the reference month.
  checkingAccounts: StatementReportCheckingAccountRow[]
  // Total balance of the checking accounts.
  checkingAccountsTotal: string
  // The reference data of the funds the portfolio holds.
  fundAssets: StatementReportFundAssetRow[]
  // The share of the portfolio per fund, largest first.
  fundDistribution: StatementReportDistributionRow[]
  // The share of the portfolio per reference index.
  indexDistribution: StatementReportDistributionRow[]
  // The share of the portfolio per financial institution.
  institutionDistribution: StatementReportDistributionRow[]
  // The patrimony and earnings per reference index.
  indexFigures: StatementReportIndexFigureRow[]
  // The patrimony and earnings per asset type.
  assetTypes: StatementReportAssetTypeRow[]
  // The compliance check against the investment policy.
  compliance: StatementReportComplianceRow[]
  // The reference month rates per index.
  indexMonths: StatementReportIndexMonthRow[]
  // The accumulated year figures per index.
  accumulatedIndexes: StatementReportAccumulatedIndexRow[]
  // The reference month rate of the portfolio against each
  // comparison index, as a share of the index.
  indexComparison: StatementReportIndexComparisonRow[]
}

/**
 * @summary
 * The dashboard KPI block of the report.
 */
export interface StatementReportKpis {
  // Chained return of the reference month.
  monthlyReturn: string | null
  // Chained return of the reference year.
  yearlyReturn: string | null
  // Market gain of the reference month, as a signed amount.
  monthlyGains: string
  // Market gain accumulated in the reference year.
  accumulatedGains: string
  // Closing patrimony of the reference month, or `null`.
  totalPatrimony: string | null
  // Portfolio return as a share of the target, in percent.
  targetShare: string | null
  // Accumulated target of the reference year, in percent.
  targetRate: string | null
}

/**
 * @summary
 * One month of the return comparison chart.
 */
export interface StatementReportPerformancePoint {
  month: string
  label: string
  // Return of the portfolio in the month, or `null`.
  portfolio: string | null
  // Target of the portfolio in the month, or `null`.
  target: string | null
}

/**
 * @summary
 * One month of the earnings chart.
 */
export interface StatementReportEarningsPoint {
  month: string
  label: string
  earnings: string
}

/**
 * @summary
 * One month of the closing patrimony table.
 */
export interface StatementReportPatrimonyPoint {
  month: string
  label: string
  patrimony: string | null
  monthlyReturn: string | null
}

/**
 * @summary
 * One month of the movements table.
 */
export interface StatementReportMovementPoint {
  month: string
  label: string
  applications: string
  withdrawals: string
  net: string
}

/**
 * @summary
 * A labeled share of the portfolio, used by the
 * distribution tables and charts.
 */
export interface StatementReportDistributionRow {
  name: string
  weight: string
  value: string
  // Hex color of the slice, assigned by the document.
  color: string
}

/**
 * @summary
 * The patrimony and the earnings of the group of funds
 * linked to one reference index.
 */
export interface StatementReportIndexFigureRow {
  name: string
  patrimony: string
  earnings: string
  weight: string
  color: string
}

/**
 * @summary
 * The patrimony and the earnings of one asset type.
 */
export interface StatementReportAssetTypeRow {
  name: string
  patrimony: string
  earnings: string
  weight: string
  color: string
}

/**
 * @summary
 * One row of the compliance table.
 */
export interface StatementReportComplianceRow {
  policy: string
  articleNumber: string
  current: string
  target: string
  maximum: string
  minimum: string
  compliant: boolean
}

/**
 * @summary
 * One month of the indices-by-month table.
 *
 * @remarks
 * The portfolio column carries the chained return of the
 * portfolio in the month; the target column carries the
 * monthly target; the index columns carry the monthly
 * reading of each registered benchmark. A missing figure
 * stays `null` so the table renders a dash.
 */
export interface StatementReportIndexMonthRow {
  month: string
  label: string
  portfolio: string | null
  target: string | null
  ipca: string | null
  cdi: string | null
  imaGeral: string | null
  ibovespa: string | null
  irfM: string | null
  irfM1: string | null
  imaB: string | null
  imaB5: string | null
}

/**
 * @summary
 * One bar of the accumulated indices chart.
 */
export interface StatementReportAccumulatedIndexRow {
  name: string
  // Accumulated rate of the index in the year, or `null`.
  rate: string | null
  // The rate as a share of the accumulated target, in
  // percent, or `null`.
  shareOfTarget: string | null
}

/**
 * @summary
 * One row of the checking account table.
 */
export interface StatementReportCheckingAccountRow {
  institution: string
  accountNumber: string
  balance: string
  weight: string
}

/**
 * @summary
 * The reference data of one fund the portfolio holds.
 */
export interface StatementReportFundAssetRow {
  cnpj: string
  name: string
  // Resolution framing of the fund, derived from the norm
  // of its category, or `null`.
  framing: string | null
  administrationFee: string | null
  // Category of the fund, shown as the row subtitle.
  categoryName: string | null
}

/**
 * @summary
 * The portfolio rate against one comparison index.
 */
export interface StatementReportIndexComparisonRow {
  name: string
  // Portfolio accumulated rate as a share of the index
  // accumulated rate, in percent, or `null`.
  share: string | null
}
