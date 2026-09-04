import type { QuotaImport } from "@/business/entities/cvm/quota-import.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import type { QuotaPrice } from "@/business/value-objects/quota-price.vo";

/**
 * A single quota row an import run attempted to write, before the
 * provenance record is created.
 */
export interface QuotaImportDraft {
  fundId: EntityId;
  date: Date;
  price: QuotaPrice;
  action: "INSERT" | "UPDATE" | "SKIP";
}

/**
 * Represents the repository contract for persisting and retrieving
 * {@link QuotaImport} provenance records.
 *
 * An `IQuotaImport`:
 * - persists provenance records through {@link IQuotaImport.saveMany}.
 * - retrieves the funds touched by an import run.
 *
 * Implementations are responsible for mapping database rows to
 * `QuotaImport` entities and back.
 */
export interface IQuotaImport {
  /**
   * Persists the provided provenance records in bulk.
   *
   * @param records - The provenance records to persist.
   * @returns A promise that resolves when the records are persisted.
   */
  saveMany(records: QuotaImport[]): Promise<void>;

  /**
   * Retrieves the distinct fund ids touched by the import run with the
   * provided id.
   *
   * @param importId - The id of the import run.
   * @returns A promise resolving to the distinct fund ids.
   */
  findFundIdsByImportId(importId: EntityId): Promise<string[]>;
}
