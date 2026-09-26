import Decimal from "decimal.js"
import { CvmSourceError } from "@/errors"

// ---------------------------------
// TYPES
// ---------------------------------

/**
 * @summary
 * A normalized row from a **CVM** `INF_DIARIO` CSV file.
 *
 * @remarks
 * Maps the `CNPJ_FUNDO`, `DT_COMPTC`, and `VL_QUOTA` columns
 * into typed fields. The price keeps its decimal string form.
 *
 * @explanation
 * Use this interface to represent one parsed line before it
 * becomes a quota upsert. The date is **UTC** midnight.
 *
 * @example
 * const ROW: CvmCsvRow = {
 *   cnpj: "12345678000199",
 *   date: new Date("2026-01-15T00:00:00.000Z"),
 *   price: "12.3456",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export interface CvmCsvRow {
  cnpj: string
  date: Date
  price: string
}

// ---------------------------------
// PARSER
// ---------------------------------

/**
 * @summary
 * Parses a **CVM** `INF_DIARIO` CSV into quota rows.
 *
 * @remarks
 * Decodes `ISO-8859-1` bytes and maps the `CNPJ_FUNDO`,
 * `DT_COMPTC`, and `VL_QUOTA` columns. Falls back to the
 * legacy `CNPJ_FUNDO_CLASSE` header. Rows with a missing
 * or invalid value are silently skipped.
 *
 * @explanation
 * Use this parser to turn one fund's monthly CSV bytes into
 * normalized rows. The price keeps its decimal string and
 * the date resolves to **UTC** midnight.
 *
 * @param bytes - Raw **CVM** file bytes to parse.
 *
 * @returns The parsed quota rows.
 *
 * @example
 * const ROWS = parseCvmCsvBytes(FILE_BYTES);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export function parseCvmCsvBytes(
  bytes: Uint8Array
): CvmCsvRow[] {
  const TEXT = new TextDecoder("iso-8859-1").decode(bytes)
  const LINES = TEXT.split(/\r?\n/)

  if (LINES.length === 0) {
    return []
  }

  const HEADER = LINES[0].split(";").map((h) => h.trim())

  const CNPJ_INDEX = headerIndex(HEADER, [
    "CNPJ_FUNDO",
    "CNPJ_FUNDO_CLASSE",
  ])
  const DATE_INDEX = headerIndex(HEADER, ["DT_COMPTC"])
  const PRICE_INDEX = headerIndex(HEADER, ["VL_QUOTA"])

  const ROWS: CvmCsvRow[] = []

  for (let i = 1; i < LINES.length; i++) {
    const LINE = LINES[i].trim()

    if (LINE.length === 0) {
      continue
    }

    const CELLS = LINE.split(";")
    const CNPJ_RAW = safeGet(CELLS, CNPJ_INDEX)

    if (CNPJ_RAW === null) {
      continue
    }

    const CNPJ = CNPJ_RAW.replace(/\D/g, "")

    if (CNPJ.length !== 14) {
      continue
    }

    const DATE_RAW = safeGet(CELLS, DATE_INDEX)
    const DATE =
      DATE_RAW !== null ? parseUtcDate(DATE_RAW) : null

    if (DATE === null) {
      continue
    }

    const PRICE_RAW = safeGet(CELLS, PRICE_INDEX)

    if (PRICE_RAW === null) {
      continue
    }

    const PRICE_CLEANED = PRICE_RAW.replace(/\s/g, "").replace(
      /,/g,
      "."
    )

    let DECIMAL: Decimal

    try {
      DECIMAL = new Decimal(PRICE_CLEANED)
    } catch {
      continue
    }

    if (!DECIMAL.isFinite() || DECIMAL.lessThanOrEqualTo(0)) {
      continue
    }

    ROWS.push({ cnpj: CNPJ, date: DATE, price: PRICE_CLEANED })
  }

  return ROWS
}

// ---------------------------------
// HELPERS
// ---------------------------------

// Finds the index of the first matching header name.
function headerIndex(header: string[], names: string[]): number {
  for (const NAME of names) {
    const INDEX = header.indexOf(NAME)

    if (INDEX !== -1) {
      return INDEX
    }
  }

  throw new CvmSourceError(
    `Missing column "${names[0]}" in **CVM** CSV header.`
  )
}

// Safely returns the trimmed cell value or null.
function safeGet(cells: string[], index: number): string | null {
  const VALUE = cells[index]?.trim() ?? ""

  return VALUE.length > 0 ? VALUE : null
}

// Parses a `YYYY-MM-DD` string to a **UTC** midnight date.
function parseUtcDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null
  }

  const PARTS = value.split("-").map(Number)
  const YEAR = PARTS[0]
  const MONTH = PARTS[1]
  const DAY = PARTS[2]
  const DATE = new Date(Date.UTC(YEAR, MONTH - 1, DAY))

  if (
    DATE.getUTCFullYear() !== YEAR ||
    DATE.getUTCMonth() !== MONTH - 1 ||
    DATE.getUTCDate() !== DAY
  ) {
    return null
  }

  return DATE
}
