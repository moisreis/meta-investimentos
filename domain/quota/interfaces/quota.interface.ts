import type { Quota } from "@domain/quota/entities/quota.entity";
import type { EntityId } from "@/value-objects";

export interface UpsertQuota {
  fundId: string;
  date: Date;
  price: string;
}

export interface UpsertQuotaResult {
  fundId: string;
  date: Date;
  price: string;
  action: "INSERT" | "UPDATE";
}

/**
 * @summary
 * Defines the repository contract for `Quota` entities.
 *
 * @remarks
 * An `IQuota` persists, retrieves, and removes quotas.
 * Supports lookup by id, fund id, and date. Bulk import
 * uses the `UpsertQuota` input and `UpsertQuotaResult`
 * output shapes.
 *
 * @explanation
 * Use this interface to implement data access for quotas.
 * Persistence implementations map rows to `Quota` entities.
 *
 * @example
 * const QUOTA = await QUOTA_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IQuota {
  /**
   * @summary
   * Retrieves the quota with the provided id.
   *
   * @remarks
   * Returns null when no quota matches.
   *
   * @explanation
   * Use this method to look up a single quota by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the quota.
   * @returns The entry or `null`.
   *
   * @example
   * const QUOTA = await QUOTA_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Quota | null>;

  /**
   * @summary
   * Retrieves all quotas of the provided fund.
   *
   * @remarks
   * Returns an empty array when no quotas match.
   *
   * @explanation
   * Use this method to list the quotas of a fund.
   * Returns an empty array for no matches.
   *
   * @param fundId - The unique identifier of the fund.
   * @returns The matching entries.
   *
   * @example
   * const QUOTAS = await QUOTA_REPO.findAllByFundId(FUND_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByFundId(fundId: EntityId): Promise<Quota[]>;

  /**
   * @summary
   * Retrieves the quota of the fund on the provided date.
   *
   * @remarks
   * Returns null when no quota matches.
   *
   * @explanation
   * Use this method to find the quota price of a fund on
   * a given date. Callers check null for existence.
   *
   * @param fundId - The unique identifier of the fund.
   * @param date - The date the quota refers to.
   * @returns The entry or `null`.
   *
   * @example
   * const QUOTA = await QUOTA_REPO
   *   .findByFundIdAndDate(FUND_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByFundIdAndDate(fundId: EntityId, date: Date): Promise<Quota | null>;

  /**
   * @summary
   * Retrieves the most recent quota of the provided fund.
   *
   * @remarks
   * Returns null when the fund has no quota.
   *
   * @explanation
   * Use this method to get the latest quota price of a
   * fund. Callers check null for no data.
   *
   * @param fundId - The unique identifier of the fund.
   * @returns The entry or `null`.
   *
   * @example
   * const QUOTA = await QUOTA_REPO
   *   .findLatestByFundId(FUND_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findLatestByFundId(fundId: EntityId): Promise<Quota | null>;

  /**
   * @summary
   * Retrieves all quotas of the provided funds.
   *
   * @remarks
   * Fund ids are stored as strings. Returns an empty
   * array when no quotas match.
   *
   * @explanation
   * Use this method to list quotas for several funds.
   * Returns an empty array for no matches.
   *
   * @param fundIds - The ids of the funds.
   * @returns The matching entries.
   *
   * @example
   * const QUOTAS = await QUOTA_REPO.findAllByFundIds(FUND_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByFundIds(fundIds: string[]): Promise<Quota[]>;

  /**
   * @summary
   * Retrieves the latest quota of each provided fund.
   *
   * @remarks
   * Fund ids are stored as strings. Returns an empty
   * array when no quotas match.
   *
   * @explanation
   * Use this method to get the most recent quota of every
   * given fund. Returns an empty array for no matches.
   *
   * @param fundIds - The ids of the funds.
   * @returns The matching entries.
   *
   * @example
   * const QUOTAS = await QUOTA_REPO
   *   .findLatestByFundIds(FUND_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findLatestByFundIds(fundIds: string[]): Promise<Quota[]>;

  /**
   * @summary
   * Retrieves quotas of the funds dated within the period.
   *
   * @remarks
   * The period is inclusive of both dates. Returns an
   * empty array when no quotas match.
   *
   * @explanation
   * Use this method to list quotas inside a date range
   * for several funds. Includes both period edges.
   *
   * @param fundIds - The ids of the funds.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns The matching entries.
   *
   * @example
   * const QUOTAS = await QUOTA_REPO
   *   .findAllByFundIdsInPeriod(FUND_IDS, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByFundIdsInPeriod(
    fundIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Quota[]>;

  /**
   * @summary
   * Persists the provided quota.
   *
   * @remarks
   * Inserts a new record when the quota has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a quota record.
   * The persisted entity with its id is returned.
   *
   * @param quota - The quota to persist.
   * @returns The persisted entry.
   *
   * @example
   * const QUOTA = await QUOTA_REPO.save(NEW_QUOTA);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(quota: Quota): Promise<Quota>;

  /**
   * @summary
   * Upserts a batch of quota rows in bulk.
   *
   * @remarks
   * Inserts a row when no quota exists for the `(fundId,
   * date)` pair; otherwise updates the existing price.
   *
   * @explanation
   * Use this method to import quota prices in bulk.
   * The result reports the action taken for each record.
   *
   * @param records - The records to upsert.
   * @returns The upsert results.
   *
   * @example
   * const RESULTS = await QUOTA_REPO.upsertMany(RECORDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  upsertMany(records: UpsertQuota[]): Promise<UpsertQuotaResult[]>;

  /**
   * @summary
   * Removes the quota with the provided id.
   *
   * @remarks
   * Resolves when the quota is removed.
   *
   * @explanation
   * Use this method to delete a quota record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the quota.
   * @returns Resolves when removed.
   *
   * @example
   * await QUOTA_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>;
}