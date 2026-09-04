import { desc, eq } from "drizzle-orm";

import { CvmImport } from "@/business/entities/cvm/cvm-import.entity";
import type { ICvmImport } from "@/business/interfaces/cvm/cvm-import.interface";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { cvmImport } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * Maps a `cvm_import` database row to a {@link CvmImport} entity.
 */
function toEntity(row: typeof cvmImport.$inferSelect): CvmImport {
  return CvmImport.create(
    {
      source: row.source,
      status: row.status as CvmImport["status"],
      requestedStart: row.requestedStart ?? undefined,
      requestedEnd: row.requestedEnd ?? undefined,
      requestedFundCnpjs: row.requestedFundCnpjs ?? undefined,
      monthsBack: row.monthsBack,
      filesFound: row.filesFound,
      filesDownloaded: row.filesDownloaded,
      filesUnavailable: row.filesUnavailable,
      recordsMatched: row.recordsMatched,
      recordsImported: row.recordsImported,
      recordsUpserted: row.recordsUpserted,
      recordsSkipped: row.recordsSkipped,
      error: row.error ?? undefined,
      startedAt: row.startedAt,
      finishedAt: row.finishedAt ?? undefined,
      createdAt: row.createdAt,
    },
    row.id,
  );
}

/**
 * PostgreSQL-backed implementation of the {@link ICvmImport} contract.
 *
 * Maps `cvm_import` rows to `CvmImport` entities and back.
 */
export class CvmImportRepository implements ICvmImport {
  private readonly db: DbClient;

  /**
   * Creates a `CvmImportRepository` bound to the provided database
   * client.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * @see {@link ICvmImport.save}
   */
  async save(imported: CvmImport): Promise<CvmImport> {
    if (imported.id) {
      const [row] = await this.db
        .update(cvmImport)
        .set({
          status: imported.status,
          filesFound: imported.filesFound,
          filesDownloaded: imported.filesDownloaded,
          filesUnavailable: imported.filesUnavailable,
          recordsMatched: imported.recordsMatched,
          recordsImported: imported.recordsImported,
          recordsUpserted: imported.recordsUpserted,
          recordsSkipped: imported.recordsSkipped,
          error: imported.error,
          finishedAt: imported.finishedAt,
        })
        .where(eq(cvmImport.id, imported.id))
        .returning();

      return toEntity(row);
    }

    const [row] = await this.db
      .insert(cvmImport)
      .values({
        source: imported.source,
        status: imported.status,
        requestedStart: imported.requestedStart,
        requestedEnd: imported.requestedEnd,
        requestedFundCnpjs: imported.requestedFundCnpjs,
        monthsBack: imported.monthsBack,
        filesFound: imported.filesFound,
        filesDownloaded: imported.filesDownloaded,
        filesUnavailable: imported.filesUnavailable,
        recordsMatched: imported.recordsMatched,
        recordsImported: imported.recordsImported,
        recordsUpserted: imported.recordsUpserted,
        recordsSkipped: imported.recordsSkipped,
        error: imported.error,
        startedAt: imported.startedAt,
        finishedAt: imported.finishedAt,
      })
      .returning();

    return toEntity(row);
  }

  /**
   * @see {@link ICvmImport.findLatest}
   */
  async findLatest(): Promise<CvmImport | null> {
    const [row] = await this.db
      .select()
      .from(cvmImport)
      .orderBy(desc(cvmImport.startedAt))
      .limit(1);

    return row ? toEntity(row) : null;
  }

  /**
   * @see {@link ICvmImport.findFailed}
   */
  async findFailed(limit = 10): Promise<CvmImport[]> {
    const ROWS = await this.db
      .select()
      .from(cvmImport)
      .where(eq(cvmImport.status, "FAILED"))
      .orderBy(desc(cvmImport.startedAt))
      .limit(limit);

    return ROWS.map(toEntity);
  }

  /**
   * @see {@link ICvmImport.findById}
   */
  async findById(id: EntityId): Promise<CvmImport | null> {
    const [row] = await this.db
      .select()
      .from(cvmImport)
      .where(eq(cvmImport.id, id))
      .limit(1);

    return row ? toEntity(row) : null;
  }
}
