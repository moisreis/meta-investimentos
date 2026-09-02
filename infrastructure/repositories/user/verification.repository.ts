import { eq, inArray } from "drizzle-orm";

import { Verification } from "@/business/entities/user/verification.entity";
import type { IVerification } from "@/business/interfaces/user/verification.interface";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { verification } from "@/infrastructure/database/schemas";
import { NotFoundError } from "@/shared/errors";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IVerification}
 * contract.
 *
 * Maps `verification` rows to `Verification` entities and back.
 * Lookups rely on the primary key and the identifier index.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class VerificationRepository implements IVerification {
  private readonly db: DbClient;

  /**
   * Creates a `VerificationRepository` bound to the provided database
   * client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided `verification` row to a {@link Verification}
   * entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Verification` entity.
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
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the
   * `verification` table.
   *
   * @param entity - The verification to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Verification): typeof verification.$inferInsert {
    return {
      identifier: entity.identifier,
      value: entity.value,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `verification` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The verification to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: Verification,
  ): Partial<typeof verification.$inferInsert> {
    return {
      identifier: entity.identifier,
      value: entity.value,
      expiresAt: entity.expiresAt,
    };
  }

  /**
   * Retrieves the verification with the provided id.
   *
   * @see {@link IVerification.findById}
   */
  async findById(id: EntityId): Promise<Verification | null> {
    const [row] = await this.db
      .select()
      .from(verification)
      .where(eq(verification.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all verifications tied to the provided identifier.
   *
   * @see {@link IVerification.findAllByIdentifier}
   */
  async findAllByIdentifier(identifier: string): Promise<Verification[]> {
    const rows = await this.db
      .select()
      .from(verification)
      .where(eq(verification.identifier, identifier));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all verifications tied to any of the provided
   * identifiers.
   *
   * Batched lookup for resolving multiple verification identifiers
   * without falling into an N+1 query pattern.
   *
   * @param identifiers - The identifiers of the verifications.
   * @returns A promise resolving to the matching `Verification`
   *   entities.
   */
  async findAllByIdentifiers(identifiers: string[]): Promise<Verification[]> {
    if (identifiers.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(verification)
      .where(inArray(verification.identifier, identifiers));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Persists the provided verification.
   *
   * @see {@link IVerification.save}
   */
  async save(persisted: Verification): Promise<Verification> {
    if (persisted.id) {
      const [row] = await this.db
        .update(verification)
        .set(this.toUpdate(persisted))
        .where(eq(verification.id, persisted.id))
        .returning();

      if (!row) {
        throw new NotFoundError(
          `Verification with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(verification)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the verification with the provided id.
   *
   * @see {@link IVerification.delete}
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(verification).where(eq(verification.id, id));
  }
}
