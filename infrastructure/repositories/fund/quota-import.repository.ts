import { eq } from "drizzle-orm";

import type { QuotaImport } from "@/business/entities/cvm/quota-import.entity";
import type { IQuotaImport } from "@/business/interfaces/cvm/quota-import.interface";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { quotaImport } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IQuotaImport} contract.
 *
 * Maps `quota_import` rows to `QuotaImport` entities and back.
 */
export class QuotaImportRepository implements IQuotaImport {
  private readonly db: DbClient;

  /**
   * Creates a `QuotaImportRepository` bound to the provided database
   * client.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * @see {@link IQuotaImport.saveMany}
   */
  async saveMany(records: QuotaImport[]): Promise<void> {
    if (records.length === 0) {
      return;
    }

    await this.db.insert(quotaImport).values(
      records.map((r) => ({
        importId: r.importId,
        fundId: r.fundId,
        date: r.date,
        price: r.price.value.toString(),
        action: r.action,
      })),
    );
  }

  /**
   * @see {@link IQuotaImport.findFundIdsByImportId}
   */
  async findFundIdsByImportId(importId: EntityId): Promise<string[]> {
    const ROWS = await this.db
      .selectDistinctOn([quotaImport.fundId])
      .from(quotaImport)
      .where(eq(quotaImport.importId, importId));

    return ROWS.map((r) => r.fundId);
  }
}
