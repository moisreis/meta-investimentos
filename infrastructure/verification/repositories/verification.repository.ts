import { eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Verification } from "@domain/verification/entities/verification.entity"
import type { IVerification } from "@domain/verification/interfaces/verification.interface"
import type { EntityId } from "@/value-objects"
import { verification } from "@db-schemas/verification.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the verification persistence contract.
 *
 * @remarks
 * Maps `verification` rows to `Verification` entities
 * and back. Lookups rely on the primary key and the
 * identifier index.
 *
 * @explanation
 * Use this repository for all verification data access
 * in the infrastructure layer. It translates rows into
 * domain entities and persists entity changes.
 *
 * @example
 * const REPO = new VerificationRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class VerificationRepository implements IVerification {
  private readonly db: DbClient

  /**
   * @summary
   * Binds the repository to a database client.
   *
   * @remarks
   * The client runs every query issued by the
   * repository.
   *
   * @explanation
   * Use this constructor to provide the **PostgreSQL**
   * client used by all repository operations.
   *
   * @param db - The **Drizzle** database client.
   *
   * @example
   * const REPO = new VerificationRepository(DB_CLIENT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  constructor(db: DbClient) {
    this.db = db
  }

  /**
   * @summary
   * Maps a database row to a domain entity.
   *
   * @remarks
   * Hydrates value objects through their `create`
   * method.
   *
   * @explanation
   * Converts persisted columns into the domain shape
   * so services work with entities, not raw rows.
   *
   * @param row - The row returned by the query.
   * @returns The hydrated entity.
   *
   * @example
   * const ENTITY = toEntity(ROW);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toEntity(row: typeof verification.$inferSelect): Verification {
    return Verification.create(
      {
        identifier: row.identifier,
        value: row.value,
        expiresAt: row.expiresAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps an entity to insert values.
   *
   * @remarks
   * Serializes value objects through their `.value`
   * property for **PostgreSQL** storage.
   *
   * @explanation
   * Converts domain columns into a shape that the
   * `verification` insert statement accepts.
   *
   * @param entity - The entity to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Verification): typeof verification.$inferInsert {
    return {
      identifier: entity.identifier,
      value: entity.value,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  /**
   * @summary
   * Maps an entity to mutable update values.
   *
   * @remarks
   * Omits `createdAt` and `updatedAt`. The `updatedAt`
   * column refreshes through the `$onUpdate` hook.
   *
   * @explanation
   * Converts domain columns into a partial shape for
   * the `verification` update statement.
   *
   * @param entity - The entity to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(
    entity: Verification
  ): Partial<typeof verification.$inferInsert> {
    return {
      identifier: entity.identifier,
      value: entity.value,
      expiresAt: entity.expiresAt,
    }
  }

  /**
   * @summary
   * Retrieves the verification with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a verification by its
   * primary key. Callers must handle the null result.
   *
   * @param id - The unique identifier.
   * @returns The entity or `null`.
   *
   * @example
   * const V = await VERIFY_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Verification | null> {
    const [row] = await this.db
      .select()
      .from(verification)
      .where(eq(verification.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all verifications for the identifier.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all verification records
   * tied to a specific identifier string.
   *
   * @param identifier - The identifier to search for.
   * @returns The matching records.
   *
   * @example
   * const VS = await VERIFY_REPO
   *   .findAllByIdentifier(IDENTIFIER);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByIdentifier(identifier: string): Promise<Verification[]> {
    const rows = await this.db
      .select()
      .from(verification)
      .where(eq(verification.identifier, identifier))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all verifications for any identifier.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern.
   * Returns an empty array when no identifiers match.
   *
   * @explanation
   * Use this method to hydrate many verifications in
   * one query instead of one query per identifier.
   *
   * @param identifiers - The identifiers to search.
   * @returns The matching records.
   *
   * @example
   * const VS = await VERIFY_REPO
   *   .findAllByIdentifiers(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByIdentifiers(identifiers: string[]): Promise<Verification[]> {
    if (identifiers.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(verification)
      .where(inArray(verification.identifier, identifiers))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided verification.
   *
   * @remarks
   * Inserts a new row when the entity has no id.
   * Updates the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a verification.
   * Returns the persisted entity with its id.
   *
   * @param persisted - The verification to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await VERIFY_REPO.save(V);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Verification): Promise<Verification> {
    if (persisted.id) {
      const [row] = await this.db
        .update(verification)
        .set(this.toUpdate(persisted))
        .where(eq(verification.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Verification with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(verification)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the verification with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a verification by its
   * primary key.
   *
   * @param id - The unique identifier of the verification.
   *
   * @example
   * await VERIFY_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(verification).where(eq(verification.id, id))
  }
}
