import type { Quota } from "@/business/entities/fund/quota.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

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
   * @param fundId - The unique identifier of the fund the quota belongs to.
   * @returns A promise resolving to the latest `Quota` or `null`
   * when not found.
   */
  findLatestByFundId(fundId: EntityId): Promise<Quota | null>;

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
   * Removes the quota with the provided id.
   *
   * @param id - The unique identifier of the quota.
   * @returns A promise that resolves when the quota is removed.
   */
  delete(id: EntityId): Promise<void>;
}
