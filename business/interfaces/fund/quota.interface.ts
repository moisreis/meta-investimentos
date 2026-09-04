import type { Quota } from "@/business/entities/fund/quota.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * A single quota row to upsert during a bulk import.
 */
export interface UpsertQuota {
  fundId: string;
  date: Date;
  price: string;
}

/**
 * The result of a single quota upsert during a bulk import.
 */
export interface UpsertQuotaResult {
  fundId: string;
  date: Date;
  price: string;
  action: "INSERT" | "UPDATE";
}

/**
 * Represents the repository contract for persisting and retrieving
 * `Quota` entities.
 *
 * An `IQuota`:
 * - persists quotas through {@link IQuota.save}.
 * - retrieves quotas by id, fund id, and date.
 * - removes quotas by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Quota` entities and back.
 */
export interface IQuota {
  /**
   * Retrieves the quota with the provided id.
   *
   * @param id - The unique identifier of the quota.
   * @returns A promise resolving to the `Quota` or `null` when
   * not found.
   */
  findById(id: EntityId): Promise<Quota | null>;

  /**
   * Retrieves all quotas that belong to the provided fund id.
   *
   * @param fundId - The unique identifier of the fund the quotas belong to.
   * @returns A promise resolving to the collection of matching
   * `Quota` entities.
   */
  findAllByFundId(fundId: EntityId): Promise<Quota[]>;

  /**
   * Retrieves the quota for the provided fund id and date.
   *
   * @param fundId - The unique identifier of the fund the quota belongs to.
   * @param date - The date the quota refers to.
   * @returns A promise resolving to the `Quota` or `null` when
   * not found.
   */
  findByFundIdAndDate(fundId: EntityId, date: Date): Promise<Quota | null>;

  /**
   * Retrieves the quota with the most recent date for the provided
   * fund id.
   *
   * @param fundId - The unique identifier of the fund the quotas belong to.
   * @returns A promise resolving to the latest `Quota` or `null`
   * when not found.
   */
  findLatestByFundId(fundId: EntityId): Promise<Quota | null>;

  /**
   * Retrieves all quotas that belong to any of the provided fund ids.
   *
   * @param fundIds - The ids of the funds to retrieve quotas for.
   * @returns A promise resolving to the matching `Quota` entities.
   */
  findAllByFundIds(fundIds: string[]): Promise<Quota[]>;

  /**
   * Retrieves the quota with the most recent date for each of the
   * provided fund ids.
   *
   * @param fundIds - The ids of the funds to retrieve quotas for.
   * @returns A promise resolving to the latest `Quota` per provided
   * fund id.
   */
  findLatestByFundIds(fundIds: string[]): Promise<Quota[]>;

  /**
   * Retrieves all quotas of the provided funds whose date falls within
   * the provided period, inclusive.
   *
   * @param fundIds - The ids of the funds to retrieve quotas for.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the matching `Quota` entities.
   */
  findAllByFundIdsInPeriod(
    fundIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Quota[]>;

  /**
   * Persists the provided quota.
   *
   * When the quota has no id, the implementation inserts a new record
   * and the persisted `Quota` (with its generated id) is returned;
   * otherwise the existing record is updated.
   *
   * @param quota - The quota to persist.
   * @returns A promise resolving to the persisted `Quota`.
   */
  save(quota: Quota): Promise<Quota>;

  /**
   * Upserts a batch of quota rows in bulk.
   *
   * For each record the implementation inserts a new row when no quota
   * with the same `(fundId, date)` exists, or updates the existing
   * row's price.
   *
   * @param records - The records to upsert.
   * @returns A promise resolving to the action taken for each record.
   */
  upsertMany(records: UpsertQuota[]): Promise<UpsertQuotaResult[]>;

  /**
   * Removes the quota with the provided id.
   *
   * @param id - The unique identifier of the quota.
   * @returns A promise that resolves when the quota is removed.
   */
  delete(id: EntityId): Promise<void>;
}
