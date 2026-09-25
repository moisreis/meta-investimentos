import { Fund } from "@domain/fund/entities/fund.entity"
import { IQuota } from "@domain/quota/interfaces/quota.interface"
import { IFund } from "@domain/fund/interfaces/fund.interface"
import type { ICvmClient } from "@/domain/quota/interfaces/cvm-client.interface"
import type { UpsertQuota } from "@domain/quota/interfaces/quota.interface"
import { parseCvmCsvBytes } from "../parsers/cvm-csv.parser"
import { extractCvmCsvFiles } from "../parsers/cvm-zip.parser"

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
 * @summary
 * A half-open date range resolved for a given import window.
 *
 * @remarks
 * The start is inclusive and the end is exclusive.
 *
 * @explanation
 * Use this interface to carry the resolved bounds returned
 * by `resolveCvmWindow`.
 *
 * @example
 * const RANGE: ImportWindowRange = {
 *   start: new Date("2026-01-01T00:00:00.000Z"),
 *   end: new Date("2026-01-31T23:59:59.999Z"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export interface ImportWindowRange {
  start: Date
  end: Date
}

/**
 * @summary
 * Input for processing a single month inside a fund slice.
 *
 * @remarks
 * Carries the year, month, resolved date range, and the slice
 * offsets used by one import call.
 *
 * @explanation
 * Use this interface to describe one unit of work handled by
 * `ImportFundValuationsUseCase.importMonth`.
 *
 * @example
 * const INPUT: ImportMonthInput = {
 *   year: 2026,
 *   month: 0,
 *   start: RANGE.start,
 *   end: RANGE.end,
 *   offset: 0,
 *   limit: 200,
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * @summary
 * Result returned by the single-month worker.
 *
 * @remarks
 * Reports scanned, imported, and skipped counts plus the
 * pagination state for the next slice.
 *
 * @explanation
 * Use this interface to inspect one month of import progress
 * and decide whether more slices are needed.
 *
 * @example
 * const RESULT: ImportMonthResult = {
 *   fundsScanned: 10,
 *   hasMore: false,
 *   nextOffset: 0,
 *   rowsImported: 420,
 *   skipped: 3,
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 *
 * @returns The resolved date range.
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

  const CLAMPED_START = new Date(
    Math.max(RAW.start.getTime(), JAN.getTime())
  )
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
          Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            1
          )
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
 * @example
 * const RESULT = await IMPORT_FUND_VALUATIONS_USE_CASE
 *   .importMonth(INPUT);
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
   * @remarks
   * Downloads the monthly **CVM** archive, parses the
   * consolidated CSV, and upserts only the tracked
   * funds' rows in small batches.
   *
   * @explanation
   * Use this method inside an **Inngest** function. The
   * caller owns the fund-slice loop and calls this method
   * once per month and offset. It never holds more data than
   * the current slice.
   *
   * @param input - The month, window dates, and slice
   *                parameters.
   *
   * @returns The slice statistics.
   *
   * @example
   * const RESULT = await IMPORT_FUND_VALUATIONS_USE_CASE
   *   .importMonth(INPUT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-17
   */
  async importMonth(
    input: ImportMonthInput
  ): Promise<ImportMonthResult> {
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

    const CSV_BYTES = extractCvmCsvFiles(ZIP_BYTES)

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
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
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
  const LAST_DAY = new Date(
    Date.UTC(YEAR, MONTH + 1, 0)
  ).getUTCDate()

  return new Date(Date.UTC(YEAR, MONTH, Math.min(DAY, LAST_DAY)))
}

// Milliseconds in a single day.
const MS_PER_DAY = 86_400_000
