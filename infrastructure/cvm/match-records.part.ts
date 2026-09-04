import type { CvmImportContext, CvmRawRecord, MatchedRecord } from "./types";

/**
 * The result of the match step.
 */
export interface MatchResult {
  matched: MatchedRecord[];
  skippedCount: number;
}

/**
 * Matches each raw CVM record to a known fund by CNPJ.
 *
 * The function strips all non-digit characters from the CNPJ before
 * comparing it against the fund map. Records whose CNPJ is unknown or
 * that parse to an invalid date are skipped.
 *
 * @param records - The raw CVM records.
 * @param context - The resolved import context.
 * @returns The matched records and the count of skipped records.
 */
export function matchRecords(
  records: CvmRawRecord[],
  context: CvmImportContext,
): MatchResult {
  const MATCHED: MatchedRecord[] = [];
  let SKIPPED = 0;

  for (const RECORD of records) {
    const DIGITS = RECORD.cnpj.replace(/\D/g, "");
    const FUND_ID = context.fundCnpjMap.get(DIGITS);

    if (!FUND_ID) {
      SKIPPED++;
      continue;
    }

    const PARSED_DATE = parseCvmDate(RECORD.date);

    if (!PARSED_DATE) {
      SKIPPED++;
      continue;
    }

    MATCHED.push({
      fundId: FUND_ID,
      cnpj: DIGITS,
      date: PARSED_DATE,
      price: RECORD.price,
    });
  }

  return { matched: MATCHED, skippedCount: SKIPPED };
}

/**
 * Parses a CVM date string (`YYYY-MM-DD`) into a `Date` or returns
 * `null` when the string is not a valid date.
 */
function parseCvmDate(value: string): Date | null {
  const MATCH = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!MATCH) {
    return null;
  }

  const YEAR = Number(MATCH[1]);
  const MONTH = Number(MATCH[2]);
  const DAY = Number(MATCH[3]);

  const DATE = new Date(Date.UTC(YEAR, MONTH - 1, DAY, 0, 0, 0, 0));

  if (
    DATE.getUTCFullYear() !== YEAR ||
    DATE.getUTCMonth() !== MONTH - 1 ||
    DATE.getUTCDate() !== DAY
  ) {
    return null;
  }

  return DATE;
}
