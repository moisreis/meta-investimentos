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
import { calculateAccumulatedTarget } from "@/domain/portfolio/calculators/accumulated-target.calculator"
import { calculatePortfolioTarget } from "@/domain/portfolio/calculators/target.calculator"
import { calculateAmountSum } from "@/domain/portfolio/calculators/amount-sum.calculator"
import { calculateHoldingAggregation } from "@/domain/portfolio/calculators/holding-aggregation.calculator"
import { calculatePerformanceShare } from "@/domain/portfolio/calculators/performance-share.calculator"
import {
  calculateDistribution,
  type DistributionRow,
} from "@/domain/portfolio/calculators/distribution.calculator"
import { calculatePortfolioCashFlowNet } from "@/domain/portfolio/calculators/cash-flow-net.calculator"
import { calculateCheckingAccountAllocation } from "@/domain/checking-account/calculators/checking-account-allocation.calculator"
import { calculateNormCompliance } from "@/domain/norm/calculators/norm-compliance.calculator"
import { calculateCashFlowNet } from "@/domain/position/calculators/cash-flow-net.calculator"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { NormResponseDTO } from "@/services/norm/dto/norm-response.dto"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"
import { PositiveMoney, SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

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
  // The index distribution reads the short acronym of the
  // benchmark, so the name of the registry never crowds the
  // donut legend.
  const BENCHMARK_ACRONYM_BY_ID = new Map(
    source.benchmarks.map((benchmark) => [
      benchmark.id,
      benchmark.acronym,
    ])
  )

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

  // The stored cumulative target is only written for a
  // portfolio whose every elapsed month carries an IPCA
  // reading, so it is null on the thin Neon history. The
  // report compounds the target from whatever IPCA readings
  // the elapsed window holds, mirroring the Rails generator,
  // and only falls back to the stored figure when the window
  // holds no reading at all.
  const IPCA_SERIES = INDEX_SERIES.get("ipca")

  // The reference-month return is the chained return the
  // shared period calculators already resolved for the same
  // window the detail screen reads, so the report and the
  // screen can never disagree. The monthly series only backs
  // it up when the window carries no resolved figure.
  const MONTH_RETURN =
    source.monthReturn ?? REFERENCE?.returnMonthly ?? null

  // The month target is `(1 + IPCA) × (1 + juros) − 1` for the
  // reference month, the same compound the daily performance
  // calculation writes on each snapshot. A report of a month
  // whose IPCA reading is missing cannot state a target, so it
  // fails loudly instead of printing a fabricated one.
  const MONTH_IPCA = IPCA_SERIES?.get(source.month) ?? null
  if (MONTH_IPCA === null) {
    throw new ValidationError(
      `\`IPCA\` reading missing for ${source.month}.`
    )
  }
  const MONTH_TARGET = calculatePortfolioTarget({
    annualInterestRate: SignedPercentage.create(
      source.portfolio.annualInterestRate
    ),
    inflationRate: SignedPercentage.create(MONTH_IPCA),
  }).value.toFixed(2)

  const TARGET_RATE =
    calculateAccumulatedTarget({
      annualInterestRate: source.portfolio.annualInterestRate,
      inflationRates: ELAPSED_MONTHS.map(
        (month) => IPCA_SERIES?.get(month) ?? null
      ),
    }) ??
    source.window.end?.cumulativeTarget ??
    null

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
      monthlyReturn: MONTH_RETURN,
      yearlyReturn: YEARLY_RETURN,
      monthlyGains: REFERENCE?.earnings ?? "0.00",
      accumulatedGains: calculateAmountSum({
        values: MONTHLY.slice(0, REFERENCE_INDEX + 1).map(
          (row) => row.earnings
        ),
      }),
      totalPatrimony: source.window.end?.patrimony ?? null,
      targetShare: calculatePerformanceShare({
        value: MONTH_RETURN,
        reference: MONTH_TARGET,
      }),
      monthTarget: MONTH_TARGET,
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
        net: calculatePortfolioCashFlowNet({
          applications: PositiveMoney.create(row.applications),
          withdrawals: PositiveMoney.create(row.withdrawals),
        }).value.toFixed(2),
      })
    ),
    checkingAccounts: BuildCheckingAccounts(source),
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
          label: BuildIndexDistributionLabel(
            holding,
            BENCHMARK_ACRONYM_BY_ID
          ),
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
      source.month,
      INDEX_SERIES,
      YEARLY_RETURN,
      TARGET_RATE,
      MONTH_RETURN,
      MONTH_TARGET
    ),
    indexComparison: BuildIndexComparison(
      MONTH_RETURN,
      source.month,
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
  // Sum of the applications of the reference month.
  applications: string
  // Sum of the withdrawals of the reference month.
  withdrawals: string
  // Sum of the earnings of the reference month.
  earnings: string
  // Net movement of the position in the reference month,
  // applications less withdrawals through the shared cash
  // flow calculator.
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
    const EARNINGS = calculateAmountSum({
      values: [CURRENT?.earnings ?? "0", SNAPSHOT.earnings],
    })
    const APPLICATIONS = calculateAmountSum({
      values: [
        CURRENT?.applications ?? "0",
        SNAPSHOT.applicationTotal,
      ],
    })
    const WITHDRAWALS = calculateAmountSum({
      values: [
        CURRENT?.withdrawals ?? "0",
        SNAPSHOT.redemptionTotal,
      ],
    })
    const MOVEMENT = calculateCashFlowNet({
      applications: PositiveMoney.create(APPLICATIONS),
      withdrawals: PositiveMoney.create(WITHDRAWALS),
    }).value

    RESULT.set(SNAPSHOT.positionId, {
      applications: APPLICATIONS,
      withdrawals: WITHDRAWALS,
      earnings: EARNINGS,
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
 *
 * @remarks
 * The bar of a tracked index carries its accumulated rate of
 * the elapsed window, so the year reads at a glance. The
 * share printed beside every row is the reference-month
 * comparison `monthReturn / benchmarkMonth × 100`, which is
 * the figure the section is meant to communicate: how much
 * of the index the portfolio captured in the month.
 */
function BuildAccumulatedIndexes(
  months: readonly string[],
  referenceMonth: string,
  series: Map<string, Map<string, string | null>>,
  yearlyReturn: string | null,
  targetRate: string | null,
  monthReturn: string | null,
  monthTarget: string | null
): StatementReportAccumulatedIndexRow[] {
  const ROWS: StatementReportAccumulatedIndexRow[] = [
    {
      name: "Carteira",
      rate: yearlyReturn,
      share: calculatePerformanceShare({
        value: monthReturn,
        reference: monthTarget,
      }),
      shareLabel: "da meta",
    },
    {
      name: "Meta",
      rate: targetRate,
      share: targetRate === null ? null : "100.00",
      shareLabel: "da meta",
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
      share: calculatePerformanceShare({
        value: monthReturn,
        reference: MAP.get(referenceMonth) ?? null,
      }),
      shareLabel: "do índice",
    })
  }

  return ROWS
}

/**
 * Builds the dashboard comparison rows: the portfolio month
 * return as a share of each comparison index's month rate.
 *
 * @remarks
 * The figure is `monthReturn / benchmarkMonth × 100`, so the
 * row states how much of the index the portfolio captured in
 * the reference month. Every comparison index keeps its row
 * even when the month holds no reading, so the chart always
 * lists the same indexes and only the figure is missing.
 */
function BuildIndexComparison(
  monthReturn: string | null,
  referenceMonth: string,
  series: Map<string, Map<string, string | null>>
): StatementReportIndexComparisonRow[] {
  const ROWS: StatementReportIndexComparisonRow[] = []

  for (const ACRONYM of STATEMENT_REPORT_COMPARISON_ACRONYMS) {
    const KEY = AcronymToKey(ACRONYM)
    const MAP = series.get(KEY)
    if (MAP === undefined) continue

    ROWS.push({
      name: ACRONYM,
      share: calculatePerformanceShare({
        value: monthReturn,
        reference: MAP.get(referenceMonth) ?? null,
      }),
    })
  }

  return ROWS
}

/**
 * Resolves the first-seen position of every label, so the
 * categorical color of a group stays stable no matter the
 * order the aggregation sorts the rows into.
 */
function BuildLabelOrder(
  entries: { label: string }[]
): Map<string, number> {
  const ORDER = new Map<string, number>()

  for (const ENTRY of entries) {
    if (!ORDER.has(ENTRY.label)) {
      ORDER.set(ENTRY.label, ORDER.size)
    }
  }

  return ORDER
}

/**
 * Groups the holdings by reference index, summing the money
 * invested and the earnings of the reference month.
 */
function BuildIndexFigures(
  source: StatementReportSource,
  positionMonth: Map<string, PositionMonthFigures>
): StatementReportIndexFigureRow[] {
  const ENTRIES = source.holdings.map((holding) => ({
    label: holding.benchmarkName ?? BuildUntrackedLabel(),
    patrimony: holding.investedValue,
    earnings:
      positionMonth.get(holding.positionId)?.earnings ?? "0",
  }))

  const ORDER = BuildLabelOrder(ENTRIES)

  return calculateHoldingAggregation(ENTRIES).map((row) => ({
    name: row.label,
    patrimony: row.patrimony,
    earnings: row.earnings,
    weight: row.weight,
    color: SeriesColor(ORDER.get(row.label) ?? 0),
  }))
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
  const ENTRIES = source.holdings.map((holding) => {
    const CATEGORY_ID =
      funds.get(holding.fundId)?.categoryId ?? null
    const NAME =
      CATEGORY_ID === null
        ? BuildUncategorizedLabel()
        : (categories.get(CATEGORY_ID)?.name ??
          BuildUncategorizedLabel())

    return {
      label: NAME,
      patrimony: holding.investedValue,
      earnings:
        positionMonth.get(holding.positionId)?.earnings ?? "0",
    }
  })

  const ORDER = BuildLabelOrder(ENTRIES)

  return calculateHoldingAggregation(ENTRIES).map((row) => ({
    name: row.label,
    patrimony: row.patrimony,
    earnings: row.earnings,
    weight: row.weight,
    color: SeriesColor(ORDER.get(row.label) ?? 0),
  }))
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
  return calculateCheckingAccountAllocation(
    source.checkingAccounts.map((account) => ({
      institution: account.institution,
      accountNumber: account.accountNumber,
      balance: account.balance,
    }))
  )
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
      framing: NORM === undefined ? null : NORM.articleNumber,
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
    cashFlowNet: snapshot.cashFlowNet,
    applicationTotal: snapshot.applicationTotal,
    redemptionTotal: snapshot.redemptionTotal,
  }
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

/**
 * Resolves the label of a holding in the index distribution:
 * the acronym of the benchmark it tracks, or the untracked
 * label when it tracks none or the registry lost it.
 */
function BuildIndexDistributionLabel(
  holding: PortfolioHolding,
  acronymById: Map<string, string>
): string {
  if (holding.benchmarkId === null) return BuildUntrackedLabel()
  return (
    acronymById.get(holding.benchmarkId) ??
    holding.benchmarkName ??
    BuildUntrackedLabel()
  )
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
