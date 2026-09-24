import { Account } from "@domain/account/entities/account.entity"
import { EntityId } from "@/value-objects"
import { account } from "@db-schemas/account.schema"

/**
 * @summary
 * Maps an account persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @explanation
 * Use this function in the repository layer to build the
 * `Account` entity from a row of the `account` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const ACCOUNT = ToDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToDomain(
  row: typeof account.$inferSelect
): Account {
  return Account.create(
    {
      providerId: row.providerId,
      accountId: row.accountId,
      userId: EntityId.create(row.userId),
      accessToken: row.accessToken,
      refreshToken: row.refreshToken,
      idToken: row.idToken,
      accessTokenExpiresAt: row.accessTokenExpiresAt,
      refreshTokenExpiresAt: row.refreshTokenExpiresAt,
      scope: row.scope,
      password: row.password,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps an account domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `account` table.
 *
 * @param entity - Account domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const ACCOUNT = ToInsert(ACCOUNT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToInsert(
  entity: Account
): typeof account.$inferInsert {
  return {
    providerId: entity.providerId,
    accountId: entity.accountId,
    userId: entity.userId,
    accessToken: entity.accessToken,
    refreshToken: entity.refreshToken,
    idToken: entity.idToken,
    accessTokenExpiresAt: entity.accessTokenExpiresAt,
    refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
    scope: entity.scope,
    password: entity.password,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps an account entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never
 * changes; the second refreshes via `$onUpdate`.
 *
 * @explanation
 * Use for updates where **Drizzle** should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Account domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const ACCOUNT = ToUpdate(ACCOUNT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export function ToUpdate(
  entity: Account
): Partial<typeof account.$inferInsert> {
  return {
    providerId: entity.providerId,
    accountId: entity.accountId,
    userId: entity.userId,
    accessToken: entity.accessToken,
    refreshToken: entity.refreshToken,
    idToken: entity.idToken,
    accessTokenExpiresAt: entity.accessTokenExpiresAt,
    refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
    scope: entity.scope,
    password: entity.password,
  }
}
