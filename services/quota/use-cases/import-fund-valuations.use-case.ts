import { Fund } from "@domain/fund/entities/fund.entity"
import { IQuota } from "@domain/quota/interfaces/quota.interface"
import { IFund } from "@domain/fund/interfaces/fund.interface"
import type { ICvmClient } from "@/domain/quota/interfaces/cvm-client.interface"
import type { UpsertQuota } from "@domain/quota/interfaces/quota.interface"
import { parseCvmCsvBytes } from "../parsers/cvm-csv.parser"
import { extractCvmFundFiles } from "../parsers/cvm-zip.parser"

// ---------------------------------
// CONSTANTS
// ---------------------------------

// Maximum number of funds processed in a single slice.
export const FUND_SLICE_SIZE = 200

// Maximum rows per batched upsert call.
export const UPSERT_CHUNK_SIZE = 100

// ---------------------------------
// TYPES
// ---------------------------------

export type CvmImportWindow =
  | "today"
  | "week"
  | "month"
  | "year-to-date"
  | "last-2-months"
  | "last-6-months"

/**
 * A half-open date range resolved for a given import window.
 */
export interface ImportWindowRange {
  start: Date
  end: Date
}

/**
 * Input for processing a single month inside a fund slice.
 */
export interface ImportMonthInput {
  year: number
  month: number
  start: Date
  end: Date
  offset: number
  limit: number
}

/**
 * Result returned by the single-month worker.
 */
export interface ImportMonthResult {
  fundsScanned: number
  hasMore: boolean
  nextOffset: number
  rowsImported: number
  skipped: number
}

// ---------------------------------
// WINDOW RESOLUTION
// ---------------------------------

/**
 * @summary
 * Resolves a `CvmImportWindow` to a **UTC** date range.
 *
 * @remarks
 * The resolved range never starts before January 1 of the
 * current year and never extends beyond today.
 *
 * @explanation
 * Use this function to translate a human-friendly window
 * option into concrete dates. It keeps all dates in **UTC**
 * and caps the upper bound to today so no future data is
 * requested.
 *
 * @param window - The window option to resolve.
 * @param now - The current reference time.
 * @returns The resolved start and end dates.
 *
 * @example
 * const RANGE = resolveCvmWindow("month");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export function resolveCvmWindow(
  window: CvmImportWindow,
  now: Date = new Date()
): ImportWindowRange {
  const TODAY = startOfUtcDay(now)
  const JAN = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
  const RAW = computeRawRange(window, TODAY, JAN)

  const CLAMPED_START = new Date(Math.max(RAW.start.getTime(), JAN.getTime()))
  const CLAMPED_END = new Date(
    Math.min(RAW.end.getTime(), endOfUtcDay(TODAY).getTime())
  )

  return { start: CLAMPED_START, end: CLAMPED_END }
}

function computeRawRange(
  window: CvmImportWindow,
  today: Date,
  jan: Date
): ImportWindowRange {
  switch (window) {
    case "today":
      return { start: today, end: endOfUtcDay(today) }

    case "week":
      return {
        start: startOfUtcMonday(today),
        end: endOfUtcDay(today),
      }

    case "month":
      return {
        start: new Date(
          Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)
        ),
        end: endOfUtcDay(today),
      }

    case "year-to-date":
      return { start: jan, end: endOfUtcDay(today) }

    case "last-2-months":
      return {
        start: startOfUtcDay(addUtcMonths(today, -2)),
        end: endOfUtcDay(today),
      }

    case "last-6-months":
      return {
        start: startOfUtcDay(addUtcMonths(today, -6)),
        end: endOfUtcDay(today),
      }
  }
}

// ---------------------------------
// USE CASE
// ---------------------------------

/**
 * @summary
 * Imports quota prices for a single month and fund slice.
 *
 * @remarks
 * Downloads the monthly **CVM** archive, extracts only the
 * fund files that belong to the current slice, and upserts
 * rows in small batches.
 *
 * @explanation
 * Use this use case inside an **Inngest** function. The
 * caller owns the fund-slice loop and calls this method
 * once per month and offset. It never holds more data than
 * the current slice.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export class ImportFundValuationsUseCase {
  constructor(
    private readonly quotaRepository: IQuota,
    private readonly fundRepository: IFund,
    private readonly cvmClient: ICvmClient
  ) {}

  /**
   * @summary
   * Fetches and persists one month of quota data.
   *
   * @param input - The month, window dates, and slice
   *                parameters.
   * @returns Aggregated statistics for this slice.
   *
   * @example
   * const RESULT = await USE_CASE.importMonth(INPUT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-17
   */
  async importMonth(input: ImportMonthInput): Promise<ImportMonthResult> {
    const FUNDS = await this.fundRepository.findAll({
      limit: input.limit,
      offset: input.offset,
    })

    const CNPJ_MAP = buildCnpjMap(FUNDS)

    if (CNPJ_MAP.size === 0) {
      return {
        fundsScanned: 0,
        hasMore: FUNDS.length === input.limit,
        nextOffset: input.offset + FUNDS.length,
        rowsImported: 0,
        skipped: 0,
      }
    }

    const ZIP_BYTES = await this.cvmClient.fetchMonthlyFile(
      input.year,
      input.month
    )

    if (ZIP_BYTES === null) {
      console.log(
        `[ImportFundValuations] No archive for ${input.year}-${input.month}.`
      )

      return {
        fundsScanned: FUNDS.length,
        hasMore: FUNDS.length === input.limit,
        nextOffset: input.offset + FUNDS.length,
        rowsImported: 0,
        skipped: 0,
      }
    }

    const CSV_BYTES = extractCvmFundFiles(ZIP_BYTES, new Set(CNPJ_MAP.keys()))

    const { upserts, skipped } = buildUpserts(
      CSV_BYTES,
      CNPJ_MAP,
      input.start,
      input.end
    )

    let rowsImported = 0

    for (let i = 0; i < upserts.length; i += UPSERT_CHUNK_SIZE) {
      const CHUNK = upserts.slice(i, i + UPSERT_CHUNK_SIZE)
      await this.quotaRepository.upsertMany(CHUNK)
      rowsImported += CHUNK.length
    }

    const HAS_MORE = FUNDS.length === input.limit
    const NEXT_OFFSET = input.offset + FUNDS.length

    console.log(
      `[ImportFundValuations] ${input.year}-${input.month}: ` +
        `imported=${rowsImported} skipped=${skipped} ` +
        `hasMore=${HAS_MORE}`
    )

    return {
      fundsScanned: FUNDS.length,
      hasMore: HAS_MORE,
      nextOffset: NEXT_OFFSET,
      rowsImported,
      skipped,
    }
  }
}

// ---------------------------------
// HELPERS
// ---------------------------------

function buildCnpjMap(funds: Fund[]): Map<string, string> {
  const MAP = new Map<string, string>()

  for (const FUND of funds) {
    if (FUND.id === undefined) {
      continue
    }

    MAP.set(FUND.cnpj.value, FUND.id)
  }

  return MAP
}

interface BuildUpsertsResult {
  upserts: UpsertQuota[]
  skipped: number
}

function buildUpserts(
  csvBytesList: Uint8Array[],
  cnpjMap: Map<string, string>,
  start: Date,
  end: Date
): BuildUpsertsResult {
  const SEEN = new Set<string>()
  const UPSERTS: UpsertQuota[] = []
  let skipped = 0

  for (const BYTES of csvBytesList) {
    const PARSED = parseCvmCsvBytes(BYTES)

    for (const ROW of PARSED) {
      const FUND_ID = cnpjMap.get(ROW.cnpj)

      if (FUND_ID === undefined) {
        skipped++
        continue
      }

      if (ROW.date < start || ROW.date > end) {
        skipped++
        continue
      }

      const KEY = `${FUND_ID}:${ROW.date.getTime()}`

      if (SEEN.has(KEY)) {
        skipped++
        continue
      }

      SEEN.add(KEY)
      UPSERTS.push({
        fundId: FUND_ID,
        date: ROW.date,
        price: ROW.price,
      })
    }
  }

  return { upserts: UPSERTS, skipped }
}

// Returns the start of the **UTC** Monday before or equal to
// the given date.
function startOfUtcMonday(date: Date): Date {
  const D = startOfUtcDay(date)
  const DAY = D.getUTCDay()
  const DIFF = (DAY + 6) % 7

  return new Date(D.getTime() - DIFF * MS_PER_DAY)
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
}

function endOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999
    )
  )
}

// Adds months to a date while preserving the day of month.
function addUtcMonths(date: Date, months: number): Date {
  const YEAR = date.getUTCFullYear()
  const MONTH = date.getUTCMonth() + months
  const DAY = date.getUTCDate()
  const LAST_DAY = new Date(Date.UTC(YEAR, MONTH + 1, 0)).getUTCDate()

  return new Date(Date.UTC(YEAR, MONTH, Math.min(DAY, LAST_DAY)))
}

// Milliseconds in a single day.
const MS_PER_DAY = 86_400_000
