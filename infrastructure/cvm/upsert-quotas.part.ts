import type {
  IQuota,
  UpsertQuotaResult,
} from "@/business/interfaces/fund/quota.interface";
import type { SanitizedRecord } from "./types";

/**
 * Upserts sanitized records into the quota table.
 *
 * @param quotaRepo - The quota repository.
 * @param records - The sanitized records to upsert.
 * @returns The upsert results.
 */
export async function upsertQuotas(
  quotaRepo: IQuota,
  records: SanitizedRecord[],
): Promise<UpsertQuotaResult[]> {
  if (records.length === 0) {
    return [];
  }

  return quotaRepo.upsertMany(
    records.map((R) => ({
      fundId: R.fundId,
      date: R.date,
      price: R.price,
    })),
  );
}
