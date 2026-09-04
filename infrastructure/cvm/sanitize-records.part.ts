import { CNPJ } from "@/business/value-objects/cnpj.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import type { MatchedRecord, SanitizedRecord } from "./types";

/**
 * The result of the sanitize step.
 */
export interface SanitizeResult {
  sanitized: SanitizedRecord[];
  skippedCount: number;
}

/**
 * Validates, sanitizes and deduplicates matched records.
 *
 * The function:
 * - Validates the CNPJ through the value object (skips when validation
 *   fails).
 * - Validates the price through `QuotaPrice` (skips when price is
 *   negative or invalid).
 * - Validates the date (skips `NaN` dates).
 * - Deduplicates by `(fundId, date)` keeping the last occurrence.
 *
 * @param records - The matched records.
 * @returns The sanitized records and the count of skipped records.
 */
export function sanitizeRecords(records: MatchedRecord[]): SanitizeResult {
  const DEDUPED = new Map<string, SanitizedRecord>();
  let SKIPPED = 0;

  for (const RECORD of records) {
    try {
      CNPJ.create(RECORD.cnpj);
    } catch {
      SKIPPED++;
      continue;
    }

    try {
      QuotaPrice.create(RECORD.price);
    } catch {
      SKIPPED++;
      continue;
    }

    if (Number.isNaN(RECORD.date.getTime())) {
      SKIPPED++;
      continue;
    }

    const KEY = `${RECORD.fundId}:${RECORD.date.getTime()}`;
    DEDUPED.set(KEY, {
      fundId: RECORD.fundId,
      date: RECORD.date,
      price: RECORD.price,
    });
  }

  return {
    sanitized: [...DEDUPED.values()],
    skippedCount: SKIPPED,
  };
}
