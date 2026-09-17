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
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Account` domain entity.
 */
export function toDomain(row: typeof account.$inferSelect): Account {
  return Account.create(
    {
      issuer: row.issuer,
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
 * @param entity - Account domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Account): typeof account.$inferInsert {
  return {
    issuer: entity.issuer,
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
 * Use for updates where Drizzle should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Account domain entity.
 * @returns Update values for the row.
 *
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: Account
): Partial<typeof account.$inferInsert> {
  return {
    issuer: entity.issuer,
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
