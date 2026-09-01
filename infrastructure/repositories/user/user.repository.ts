import { eq, inArray } from "drizzle-orm";

import { User } from "@/business/entities/user/user.entity";
import type { IUser } from "@/business/interfaces/user/user.interface";
import CPF from "@/business/value-objects/cpf.vo";
import { user } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IUser} contract.
 *
 * Maps `user` rows to `User` entities and back. Every lookup uses a
 * unique index on the table: the primary key (`findById`), the email
 * unique constraint (`findByEmail`) and the cpf unique constraint
 * (`findByCpf`).
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise, letting the database generate the uuid.
 * Updates intentionally omit `updatedAt` so the `$onUpdate` hook keeps
 * the timestamp consistent with the mutation.
 *
 * The batch {@link UserRepository.findAllByIds} lookup exists because a
 * single filter across many users (for example when hydrating audit
 * trails or statements) would otherwise issue one query per user.
 */
export class UserRepository implements IUser {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `UserRepository` bound to the provided database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  // --------------------------------------
  // MAPPING METHODS
  // --------------------------------------

  /**
   * Maps the provided `user` row to a {@link User} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `User` entity.
   */
  private toEntity(row: typeof user.$inferSelect): User {
    return User.create(
      {
        name: row.name,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        cpf: CPF.create(row.cpf),
        role: row.role,
        emailVerified: row.emailVerified,
        image: row.image,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `user` table.
   *
   * @param entity - The user to persist.
   * @returns The insert values.
   */
  private toInsert(entity: User): typeof user.$inferInsert {
    return {
      name: entity.name,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      cpf: entity.cpf.value,
      role: entity.role,
      emailVerified: entity.emailVerified,
      image: entity.image,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `user` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The user to persist.
   * @returns The update values.
   */
  private toUpdate(entity: User): Partial<typeof user.$inferInsert> {
    return {
      name: entity.name,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      cpf: entity.cpf.value,
      role: entity.role,
      emailVerified: entity.emailVerified,
      image: entity.image,
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the user with the provided id.
   *
   * @see {@link IUser.findById}
   */
  async findById(id: string): Promise<User | null> {
    const [row] = await this.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the user with the provided email.
   *
   * @see {@link IUser.findByEmail}
   */
  async findByEmail(email: string): Promise<User | null> {
    const [row] = await this.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the user with the provided cpf.
   *
   * @see {@link IUser.findByCpf}
   */
  async findByCpf(cpf: string): Promise<User | null> {
    const [row] = await this.db
      .select()
      .from(user)
      .where(eq(user.cpf, cpf))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all users with any of the provided ids.
   *
   * This is a batched lookup: every additional id would otherwise
   * cost one extra round-trip, turning a multi-user hydration into
   * an N+1 query pattern.
   *
   * @param ids - The ids of the users to retrieve.
   * @returns A promise resolving to the matching `User` entities.
   */
  async findAllByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.db.select().from(user).where(inArray(user.id, ids));

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided user.
   *
   * @see {@link IUser.save}
   */
  async save(persisted: User): Promise<User> {
    if (persisted.id) {
      const [row] = await this.db
        .update(user)
        .set(this.toUpdate(persisted))
        .where(eq(user.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`User with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(user)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the user with the provided id.
   *
   * @see {@link IUser.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(user).where(eq(user.id, id));
  }
}
