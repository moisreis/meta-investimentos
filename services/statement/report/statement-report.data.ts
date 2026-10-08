import Decimal from "decimal.js"

import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"
import type { PeriodWindow } from "@/lib/performance/period-window.calculator"
import { BuildYearMonthKeys } from "@/lib/date/month-key"
import {
  accumulateBenchmarkRates,
  calculateBenchmarkMonthlyRates,
} from "@/domain/benchmark/calculators/benchmark-monthly-series.calculator"
import {
  calculateMonthlyPerformance,
  type MonthlyPerformanceSnapshot,
} from "@/domain/portfolio/calculators/monthly-performance.calculator"
import { calculatePortfolioCategoryAllocation } from "@/domain/portfolio/calculators/category-allocation.calculator"
import {
  calculateDistribution,
  type DistributionRow,
} from "@/domain/portfolio/calculators/distribution.calculator"
import { calculateNormCompliance } from "@/domain/norm/calculators/norm-compliance.calculator"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { NormResponseDTO } from "@/services/norm/dto/norm-response.dto"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

import {
  STATEMENT_REPORT_COMPARISON_ACRONYMS,
  STATEMENT_REPORT_INDEX_ACRONYMS,
  STATEMENT_REPORT_MONTH_LABELS,
  STATEMENT_REPORT_SERIES_COLORS,
} from "./statement-report.constants"
import type {
  StatementReportAccumulatedIndexRow,
  StatementReportAssetTypeRow,
  StatementReportCheckingAccountRow,
  StatementReportComplianceRow,
  StatementReportData,
  StatementReportDistributionRow,
  StatementReportEarningsPoint,
  StatementReportFundAssetRow,
  StatementReportIndexComparisonRow,
  StatementReportIndexFigureRow,
  StatementReportIndexMonthRow,
  StatementReportMovementPoint,
  StatementReportPatrimonyPoint,
  StatementReportPerformancePoint,
  StatementReportPositionRow,
} from "./statement-report.types"

/**
 * The registered benchmark of the report comparison table,
 * with its monthly readings.
 */
export interface StatementReportBenchmarkSource {
  id: string
  acronym: string
  name: string
  // Monthly readings of the benchmark, in any order.
  history: { date: string; rate: string }[]
}

/**
 * A checking account balance of the reference month, already
 * joined to the institution and the account digits.
 */
export interface StatementReportCheckingAccountSource {
  institution: string
  accountNumber: string
  balance: string
}

/**
 * The shared inputs a finished statement report is built
 * from.
 *
 * @remarks
 * The holdings are the exact read model of the extrato
 * pipeline, resolved from the shared holding mapper that the
 * portfolio overview uses. The window and the month return
 * are the shared period calculators of the portfolio
 * performance registry, and the registries that name the
 * report rows (the funds, the categories, the norms and the
 * benchmarks with their readings) come from the shared list
 * use cases of the screens. Nothing here is summed, filtered
 * or queried again by the report mapper.
 */
export interface StatementReportSource {
  portfolio: PortfolioResponseDTO
  month: string
  periodStart: string
  periodEnd: string
  // Holdings of the portfolio, resolved by the shared holding
  // mapper of the extrato, by weight.
  holdings: PortfolioHolding[]
  // The month window over the portfolio snapshots, closed by
  // the shared period window calculator.
  window: PeriodWindow<PortfolioPerformanceResponseDTO>
  // Chained month return of the window, resolved by the
  // shared period returns use case.
  monthReturn: string | null
  // Every daily snapshot of the portfolio, used to build the
  // month series of the reference year.
  performances: PortfolioPerformanceResponseDTO[]
  // Funds of the registry, resolved by the shared list use
  // case. The holding rows carry fund ids, and this registry
  // is what turns them into categories.
  funds: FundResponseDTO[]
  // Registered categories, resolved by the shared list use
  // case.
  categories: CategoryResponseDTO[]
  // Norms of the categories the portfolio funds belong to,
  // flattened by the report composition root.
  norms: NormResponseDTO[]
  // Performance snapshots of every position of the portfolio,
  // resolved by the shared position performance use case.
  positionPerformances: PositionPerformanceResponseDTO[]
  // Registered benchmarks with their readings, resolved
  // through the benchmark history use case.
  benchmarks: StatementReportBenchmarkSource[]
  // Checking account balances of the reference month, joined
  // to the institution and the account digits.
  checkingAccounts: StatementReportCheckingAccountSource[]
}

/**
 * @summary
 * Builds the statement report model from the shared data.
 *
 * @remarks
 * Projects the extrato read models onto the report rows: the
 * category and the norm article of each position and fund
 * come from the registries the composition root resolves, the
 * month series and the position figures come from the shared
 * performance snapshots, the distributions come from the
 * shared aggregate calculators and the comparison rates come
 * from the benchmark readings the composition root loads.
 * The mapper never filters, sums or queries anything itself —
 * it only relabels the figures the screens already computed.
 *
 * @explanation
 * Use this mapper to prepare the data that the statement PDF
 * renders. It stays pure and never touches repositories or
 * the document layer.
 *
 * @param source - The shared report inputs.
 *
 * @returns The display-ready report model.
 *
 * @example
 * const DATA = BuildStatementReportData(SOURCE);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function BuildStatementReportData(
  source: StatementReportSource
): StatementReportData {
  const ISSUED_AT = new Date().toISOString()

  const FUND_BY_ID = new Map(
    source.funds.map((fund) => [fund.id, fund])
  )
  const CATEGORY_BY_ID = new Map(
    source.categories.map((category) => [category.id, category])
  )
  const NORM_BY_CATEGORY_ID = new Map<string, NormResponseDTO>()
  for (const NORM of source.norms) {
    if (!NORM_BY_CATEGORY_ID.has(NORM.categoryId)) {
      NORM_BY_CATEGORY_ID.set(NORM.categoryId, NORM)
    }
  }

  // The reference year is the year of the requested month.
  const YEAR = Number(source.month.slice(0, 4))
  const MONTH_KEYS = BuildYearMonthKeys(YEAR)
  const MONTH_LABELS = STATEMENT_REPORT_MONTH_LABELS
  const REFERENCE_INDEX = MONTH_KEYS.indexOf(source.month)

  const MONTHLY = calculateMonthlyPerformance(
    source.performances
      .filter((snapshot) => snapshot.date <= source.periodEnd)
      .map(ToMonthlySnapshot),
    MONTH_KEYS
  )
  const REFERENCE = MONTHLY[REFERENCE_INDEX] ?? null

  const POSITION_MONTH = BuildPositionMonthFigures(source)

  const POSITIONS = source.holdings.map((holding) =>
    ToPositionRow(
      holding,
      FUND_BY_ID,
      CATEGORY_BY_ID,
      NORM_BY_CATEGORY_ID,
      POSITION_MONTH
    )
  )

  const ALLOCATION = calculatePortfolioCategoryAllocation(
    source.holdings.map((holding) => {
      const CATEGORY_ID =
        FUND_BY_ID.get(holding.fundId)?.categoryId ?? null
      return {
        categoryName:
          CATEGORY_ID === null
            ? null
            : (CATEGORY_BY_ID.get(CATEGORY_ID)?.name ?? null),
        investedValue: holding.investedValue,
      }
    })
  )

  const INDEX_SERIES = BuildIndexSeries(source, MONTH_KEYS)

  // Only the months elapsed up to the reference month feed
  // an accumulated figure, so a December report and an
  // August report never read the same window.
  const ELAPSED_MONTHS = MONTH_KEYS.slice(0, REFERENCE_INDEX + 1)

  const YEARLY_RETURN = source.window.end?.returnYearly ?? null
  const TARGET_RATE = source.window.end?.cumulativeTarget ?? null

  return {
    portfolio: source.portfolio,
    month: source.month,
    periodStart: source.periodStart,
    periodEnd: source.periodEnd,
    periodLabel: BuildMonthLabel(source.month),
    issuedAt: ISSUED_AT,
    cover: {
      portfolioName: source.portfolio.name,
      portfolioAcronym: source.portfolio.acronym,
      periodLabel: BuildMonthLabel(source.month),
      periodStart: source.periodStart,
      periodEnd: source.periodEnd,
      issuedAt: ISSUED_AT,
    },
    positions: POSITIONS,
    kpis: {
      monthlyReturn:
        REFERENCE?.returnMonthly ?? source.monthReturn,
      yearlyReturn: YEARLY_RETURN,
      monthlyGains: REFERENCE?.earnings ?? "0.00",
      accumulatedGains: AccumulateEarnings(
        MONTHLY,
        REFERENCE_INDEX
      ),
      totalPatrimony: source.window.end?.patrimony ?? null,
      targetShare: ShareOf(YEARLY_RETURN, TARGET_RATE),
      targetRate: TARGET_RATE,
    },
    performance: MONTHLY.map<StatementReportPerformancePoint>(
      (row, index) => ({
        month: row.month,
        label: MONTH_LABELS[index],
        portfolio: row.returnMonthly,
        target: row.target,
      })
    ),
    monthlyEarnings: MONTHLY.map<StatementReportEarningsPoint>(
      (row, index) => ({
        month: row.month,
        label: MONTH_LABELS[index],
        earnings: row.earnings,
      })
    ),
    patrimonyMonths: MONTHLY.map<StatementReportPatrimonyPoint>(
      (row, index) => ({
        month: row.month,
        label: MONTH_LABELS[index],
        patrimony: row.patrimony,
        monthlyReturn: row.returnMonthly,
      })
    ),
    movementMonths: MONTHLY.map<StatementReportMovementPoint>(
      (row, index) => ({
        month: row.month,
        label: MONTH_LABELS[index],
        applications: row.applications,
        withdrawals: row.withdrawals,
        net: new Decimal(row.applications)
          .minus(row.withdrawals)
          .toFixed(2),
      })
    ),
    checkingAccounts: BuildCheckingAccounts(source),
    checkingAccountsTotal: BuildCheckingAccountsTotal(source),
    fundAssets: BuildFundAssets(
      source,
      FUND_BY_ID,
      CATEGORY_BY_ID,
      NORM_BY_CATEGORY_ID
    ),
    fundDistribution: ToDistribution(
      calculateDistribution(
        source.holdings.map((holding) => ({
          label: holding.fundName,
          value: holding.investedValue,
        }))
      )
    ),
    indexDistribution: ToDistribution(
      calculateDistribution(
        source.holdings.map((holding) => ({
          label: holding.benchmarkName ?? BuildUntrackedLabel(),
          value: holding.investedValue,
        }))
      )
    ),
    institutionDistribution: ToDistribution(
      calculateDistribution(
        source.holdings.map((holding) => ({
          label: holding.bankName,
          value: holding.investedValue,
        }))
      )
    ),
    indexFigures: BuildIndexFigures(source, POSITION_MONTH),
    assetTypes: BuildAssetTypes(
      source,
      FUND_BY_ID,
      CATEGORY_BY_ID,
      POSITION_MONTH
    ),
    compliance: BuildCompliance(source, ALLOCATION),
    indexMonths: MONTH_KEYS.map<StatementReportIndexMonthRow>(
      (month, index) => ({
        month,
        label: MONTH_LABELS[index],
        portfolio: MONTHLY[index].returnMonthly,
        target: MONTHLY[index].target,
        ipca: INDEX_SERIES.get("ipca")?.get(month) ?? null,
        cdi: INDEX_SERIES.get("cdi")?.get(month) ?? null,
        imaGeral:
          INDEX_SERIES.get("imaGeral")?.get(month) ?? null,
        ibovespa:
          INDEX_SERIES.get("ibovespa")?.get(month) ?? null,
        irfM: INDEX_SERIES.get("irfM")?.get(month) ?? null,
        irfM1: INDEX_SERIES.get("irfM1")?.get(month) ?? null,
        imaB: INDEX_SERIES.get("imaB")?.get(month) ?? null,
        imaB5: INDEX_SERIES.get("imaB5")?.get(month) ?? null,
      })
    ),
    accumulatedIndexes: BuildAccumulatedIndexes(
      ELAPSED_MONTHS,
      INDEX_SERIES,
      YEARLY_RETURN,
      TARGET_RATE
    ),
    indexComparison: BuildIndexComparison(
      YEARLY_RETURN,
      ELAPSED_MONTHS,
      INDEX_SERIES
    ),
  }
}

/**
 * Projects a holding onto the report position row, joining
 * the category, the norm article and the month figures the
 * position performance registry resolved.
 */
function ToPositionRow(
  holding: PortfolioHolding,
  funds: Map<string, FundResponseDTO>,
  categories: Map<string, CategoryResponseDTO>,
  norms: Map<string, NormResponseDTO>,
  positionMonth: Map<string, PositionMonthFigures>
): StatementReportPositionRow {
  const CATEGORY_ID =
    funds.get(holding.fundId)?.categoryId ?? null
  const FIGURES = positionMonth.get(holding.positionId)

  return {
    fundName: holding.fundName,
    bankName: holding.bankName,
    bankCode: holding.bankCode,
    categoryName:
      CATEGORY_ID === null
        ? null
        : (categories.get(CATEGORY_ID)?.name ?? null),
    articleNumber:
      CATEGORY_ID === null
        ? null
        : (norms.get(CATEGORY_ID)?.articleNumber ?? null),
    weight: holding.weight,
    investedValue: holding.investedValue,
    earnings: FIGURES ? FIGURES.earnings : null,
    movement: FIGURES ? FIGURES.movement : null,
    finalValue: FIGURES?.latest.patrimony ?? null,
    returnMonthly: FIGURES?.latest.returnMonthly ?? null,
    returnYearly: FIGURES?.latest.returnYearly ?? null,
    returnLast12m: FIGURES?.latest.returnLast12m ?? null,
    fundShare: null,
  }
}

/**
 * The month figures of one position, already resolved.
 */
interface PositionMonthFigures {
  // Sum of the earnings of the reference month.
  earnings: string
  // Net movement of the position in the reference month.
  movement: string
  // Latest snapshot of the reference month.
  latest: PositionPerformanceResponseDTO
}

/**
 * Aggregates the position performance snapshots of the
 * reference month into one figure set per position.
 */
function BuildPositionMonthFigures(
  source: StatementReportSource
): Map<string, PositionMonthFigures> {
  const RESULT = new Map<string, PositionMonthFigures>()

  for (const SNAPSHOT of source.positionPerformances) {
    if (
      SNAPSHOT.date < source.periodStart ||
      SNAPSHOT.date > source.periodEnd
    ) {
      continue
    }

    const CURRENT = RESULT.get(SNAPSHOT.positionId)
    const EARNINGS = new Decimal(CURRENT?.earnings ?? "0").plus(
      SNAPSHOT.earnings
    )
    const MOVEMENT = new Decimal(CURRENT?.movement ?? "0").plus(
      SNAPSHOT.cashFlowNet
    )

    RESULT.set(SNAPSHOT.positionId, {
      earnings: EARNINGS.toFixed(2),
      movement: MOVEMENT.toFixed(2),
      latest:
        CURRENT === undefined ||
        SNAPSHOT.date >= CURRENT.latest.date
          ? SNAPSHOT
          : CURRENT.latest,
    })
  }

  return RESULT
}

/**
 * Resolves the monthly rate series of every tracked index for
 * the provided months, keyed by the constant key.
 */
function BuildIndexSeries(
  source: StatementReportSource,
  months: readonly string[]
): Map<string, Map<string, string | null>> {
  const RESULT = new Map<string, Map<string, string | null>>()

  for (const [KEY, ACRONYM] of Object.entries(
    STATEMENT_REPORT_INDEX_ACRONYMS
  )) {
    const BENCHMARK = FindBenchmark(source.benchmarks, ACRONYM)
    const SERIES =
      BENCHMARK === undefined
        ? []
        : calculateBenchmarkMonthlyRates({
            entries: BENCHMARK.history,
            months,
          })

    RESULT.set(
      KEY,
      new Map(SERIES.map((row) => [row.month, row.rate]))
    )
  }

  return RESULT
}

/**
 * Builds the accumulated index rows: the portfolio and the
 * target first, then the tracked indexes with a registered
 * reading.
 */
function BuildAccumulatedIndexes(
  months: readonly string[],
  series: Map<string, Map<string, string | null>>,
  yearlyReturn: string | null,
  targetRate: string | null
): StatementReportAccumulatedIndexRow[] {
  const ROWS: StatementReportAccumulatedIndexRow[] = [
    {
      name: "Carteira",
      rate: yearlyReturn,
      shareOfTarget: ShareOf(yearlyReturn, targetRate),
    },
    {
      name: "Meta",
      rate: targetRate,
      shareOfTarget: targetRate === null ? null : "100.00",
    },
  ]

  const TRACKED: [string, string][] = [
    ["IPCA", "ipca"],
    ["CDI", "cdi"],
    ["IMA-Geral", "imaGeral"],
    ["Ibovespa", "ibovespa"],
  ]

  for (const [NAME, KEY] of TRACKED) {
    const MAP = series.get(KEY)
    if (MAP === undefined) continue

    const RATE = accumulateBenchmarkRates(
      months.map((month) => MAP.get(month) ?? null)
    )

    if (RATE === null) continue

    ROWS.push({
      name: NAME,
      rate: RATE,
      shareOfTarget: ShareOf(RATE, targetRate),
    })
  }

  return ROWS
}

/**
 * Builds the dashboard comparison rows: the portfolio year
 * return as a share of each comparison index.
 */
function BuildIndexComparison(
  yearlyReturn: string | null,
  months: readonly string[],
  series: Map<string, Map<string, string | null>>
): StatementReportIndexComparisonRow[] {
  const ROWS: StatementReportIndexComparisonRow[] = []

  for (const ACRONYM of STATEMENT_REPORT_COMPARISON_ACRONYMS) {
    const KEY = AcronymToKey(ACRONYM)
    const MAP = series.get(KEY)
    if (MAP === undefined) continue

    const RATE = accumulateBenchmarkRates(
      months.map((month) => MAP.get(month) ?? null)
    )

    // An index with no elapsed reading is left out of the
    // comparison chart instead of rendering a blank bar.
    if (RATE === null) continue

    ROWS.push({
      name: ACRONYM,
      share: ShareOf(yearlyReturn, RATE),
    })
  }

  return ROWS
}

/**
 * Groups the holdings by reference index, summing the money
 * invested and the earnings of the reference month.
 */
function BuildIndexFigures(
  source: StatementReportSource,
  positionMonth: Map<string, PositionMonthFigures>
): StatementReportIndexFigureRow[] {
  const GROUPS = new Map<
    string,
    { patrimony: Decimal; earnings: Decimal }
  >()

  for (const HOLDING of source.holdings) {
    const NAME = HOLDING.benchmarkName ?? BuildUntrackedLabel()
    const GROUP = GROUPS.get(NAME) ?? {
      patrimony: new Decimal(0),
      earnings: new Decimal(0),
    }
    const EARNINGS = positionMonth.get(HOLDING.positionId)

    GROUP.patrimony = GROUP.patrimony.plus(HOLDING.investedValue)
    GROUP.earnings = GROUP.earnings.plus(
      EARNINGS?.earnings ?? "0"
    )
    GROUPS.set(NAME, GROUP)
  }

  const TOTAL = [...GROUPS.values()].reduce(
    (sum, group) => sum.plus(group.patrimony),
    new Decimal(0)
  )

  return [...GROUPS.entries()]
    .map(([NAME, GROUP], index) => ({
      name: NAME,
      patrimony: GROUP.patrimony.toFixed(2),
      earnings: GROUP.earnings.toFixed(2),
      weight: TOTAL.isZero()
        ? "0.00"
        : GROUP.patrimony.dividedBy(TOTAL).times(100).toFixed(2),
      color: SeriesColor(index),
    }))
    .sort((left, right) =>
      new Decimal(right.patrimony).cmp(
        new Decimal(left.patrimony)
      )
    )
}

/**
 * Groups the holdings by asset type (the category of the
 * fund), summing the money invested and the earnings of the
 * reference month.
 */
function BuildAssetTypes(
  source: StatementReportSource,
  funds: Map<string, FundResponseDTO>,
  categories: Map<string, CategoryResponseDTO>,
  positionMonth: Map<string, PositionMonthFigures>
): StatementReportAssetTypeRow[] {
  const GROUPS = new Map<
    string,
    { patrimony: Decimal; earnings: Decimal }
  >()

  for (const HOLDING of source.holdings) {
    const CATEGORY_ID =
      funds.get(HOLDING.fundId)?.categoryId ?? null
    const NAME =
      CATEGORY_ID === null
        ? BuildUncategorizedLabel()
        : (categories.get(CATEGORY_ID)?.name ??
          BuildUncategorizedLabel())
    const GROUP = GROUPS.get(NAME) ?? {
      patrimony: new Decimal(0),
      earnings: new Decimal(0),
    }
    const EARNINGS = positionMonth.get(HOLDING.positionId)

    GROUP.patrimony = GROUP.patrimony.plus(HOLDING.investedValue)
    GROUP.earnings = GROUP.earnings.plus(
      EARNINGS?.earnings ?? "0"
    )
    GROUPS.set(NAME, GROUP)
  }

  const TOTAL = [...GROUPS.values()].reduce(
    (sum, group) => sum.plus(group.patrimony),
    new Decimal(0)
  )

  return [...GROUPS.entries()]
    .map(([NAME, GROUP], index) => ({
      name: NAME,
      patrimony: GROUP.patrimony.toFixed(2),
      earnings: GROUP.earnings.toFixed(2),
      weight: TOTAL.isZero()
        ? "0.00"
        : GROUP.patrimony.dividedBy(TOTAL).times(100).toFixed(2),
      color: SeriesColor(index),
    }))
    .sort((left, right) =>
      new Decimal(right.patrimony).cmp(
        new Decimal(left.patrimony)
      )
    )
}

/**
 * Builds the compliance rows of the registered policies
 * against the current category allocation.
 */
function BuildCompliance(
  source: StatementReportSource,
  allocation: { categoryName: string | null; weight: string }[]
): StatementReportComplianceRow[] {
  const CATEGORY_BY_ID = new Map(
    source.categories.map((category) => [category.id, category])
  )

  const POLICIES = source.norms.map((norm) => ({
    name: norm.name,
    articleNumber: norm.articleNumber,
    categoryName:
      CATEGORY_BY_ID.get(norm.categoryId)?.name ?? norm.name,
    targetAllocation: norm.targetAllocation,
    minAllocation: norm.minAllocation,
    maxAllocation: norm.maxAllocation,
  }))

  return calculateNormCompliance({
    policies: POLICIES,
    allocation,
  })
}

/**
 * Builds the checking account rows of the reference month,
 * largest balance first.
 */
function BuildCheckingAccounts(
  source: StatementReportSource
): StatementReportCheckingAccountRow[] {
  const TOTAL = new Decimal(BuildCheckingAccountsTotal(source))

  return source.checkingAccounts
    .map((account) => ({
      institution: account.institution,
      accountNumber: account.accountNumber,
      balance: new Decimal(account.balance).toFixed(2),
      weight: TOTAL.isZero()
        ? "0.00"
        : new Decimal(account.balance)
            .dividedBy(TOTAL)
            .times(100)
            .toFixed(2),
    }))
    .sort((left, right) =>
      new Decimal(right.balance).cmp(new Decimal(left.balance))
    )
}

/**
 * Sums the checking account balances of the reference month.
 */
function BuildCheckingAccountsTotal(
  source: StatementReportSource
): string {
  return source.checkingAccounts
    .reduce(
      (sum, account) => sum.plus(account.balance),
      new Decimal(0)
    )
    .toFixed(2)
}

/**
 * Builds the reference data of the funds the portfolio holds,
 * deduplicated by fund and joined to the norm of its
 * category.
 */
function BuildFundAssets(
  source: StatementReportSource,
  funds: Map<string, FundResponseDTO>,
  categories: Map<string, CategoryResponseDTO>,
  norms: Map<string, NormResponseDTO>
): StatementReportFundAssetRow[] {
  const SEEN = new Set<string>()
  const ROWS: StatementReportFundAssetRow[] = []

  for (const HOLDING of source.holdings) {
    if (SEEN.has(HOLDING.fundId)) continue
    SEEN.add(HOLDING.fundId)

    const FUND = funds.get(HOLDING.fundId)
    if (FUND === undefined) continue

    const CATEGORY_ID = FUND.categoryId
    const NORM =
      CATEGORY_ID === null ? undefined : norms.get(CATEGORY_ID)

    ROWS.push({
      cnpj: FUND.cnpj,
      name: FUND.name,
      framing:
        NORM === undefined
          ? null
          : `${NORM.name} - ${NORM.articleNumber}`,
      administrationFee: FUND.administrationFee,
      // The category name is kept for the subtitle of the row.
      categoryName:
        CATEGORY_ID === null
          ? null
          : (categories.get(CATEGORY_ID)?.name ?? null),
    })
  }

  return ROWS
}

/**
 * Maps a distribution row onto the report distribution row
 * and assigns the categorical color by position.
 */
function ToDistribution(
  rows: readonly DistributionRow[]
): StatementReportDistributionRow[] {
  return rows.map((row, index) => ({
    name: row.label,
    weight: row.weight,
    value: row.value,
    color: SeriesColor(index),
  }))
}

/**
 * Projects a portfolio snapshot onto the monthly
 * performance snapshot.
 */
function ToMonthlySnapshot(
  snapshot: PortfolioPerformanceResponseDTO
): MonthlyPerformanceSnapshot {
  return {
    date: snapshot.date,
    returnDaily: snapshot.returnDaily,
    returnMonthly: snapshot.returnMonthly,
    target: snapshot.target,
    earnings: snapshot.earnings,
    patrimony: snapshot.patrimony,
    applicationTotal: snapshot.applicationTotal,
    redemptionTotal: snapshot.redemptionTotal,
  }
}

/**
 * Sums the earnings of the months from January to the
 * reference month.
 */
function AccumulateEarnings(
  rows: { earnings: string }[],
  referenceIndex: number
): string {
  if (referenceIndex < 0) return "0.00"

  return rows
    .slice(0, referenceIndex + 1)
    .reduce((sum, row) => sum.plus(row.earnings), new Decimal(0))
    .toFixed(2)
}

/**
 * Resolves the share of a value over a reference, in percent,
 * or `null` when either side is missing or the reference is
 * zero.
 */
function ShareOf(
  value: string | null,
  reference: string | null
): string | null {
  if (value === null || reference === null) return null
  const BASE = new Decimal(reference)
  if (BASE.isZero()) return null
  return new Decimal(value).dividedBy(BASE).times(100).toFixed(2)
}

/**
 * Normalizes a benchmark acronym for comparison, dropping
 * spaces, dashes and underscores.
 */
function NormalizeAcronym(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[\s_-]/g, "")
}

/**
 * Finds a benchmark by acronym, normalized.
 */
function FindBenchmark(
  benchmarks: readonly StatementReportBenchmarkSource[],
  acronym: string
): StatementReportBenchmarkSource | undefined {
  const TARGET = NormalizeAcronym(acronym)
  return benchmarks.find(
    (benchmark) => NormalizeAcronym(benchmark.acronym) === TARGET
  )
}

/**
 * Maps a canonical comparison acronym to its index series key.
 */
function AcronymToKey(acronym: string): string {
  for (const [KEY, VALUE] of Object.entries(
    STATEMENT_REPORT_INDEX_ACRONYMS
  )) {
    if (NormalizeAcronym(VALUE) === NormalizeAcronym(acronym)) {
      return KEY
    }
  }
  return acronym
}

/**
 * Picks the categorical color at a position, wrapping when
 * the palette runs out.
 */
function SeriesColor(index: number): string {
  return STATEMENT_REPORT_SERIES_COLORS[
    index % STATEMENT_REPORT_SERIES_COLORS.length
  ]
}

// Labels used when a registry value is missing.
function BuildUntrackedLabel(): string {
  return "Sem índice"
}

function BuildUncategorizedLabel(): string {
  return "Sem categoria"
}

/**
 * Builds the `MMMM de yyyy` label of a month key.
 */
function BuildMonthLabel(month: string): string {
  const [YEAR, MONTH_NUMBER] = month.split("-").map(Number)
  const FIRST_DAY = new Date(Date.UTC(YEAR, MONTH_NUMBER - 1, 1))
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(FIRST_DAY)
}
