import { User } from "@domain/user/entities/user.entity"
import { CPF } from "@/value-objects"
import { user } from "@db-schemas/user.schema"

/**
 * @summary
 * Maps a user persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `User` domain entity.
 */
export function toDomain(row: typeof user.$inferSelect): User {
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
    row.id
  )
}

/**
 * @summary
 * Maps a user domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - User domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: User): typeof user.$inferInsert {
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
  }
}

/**
 * @summary Maps an entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never changes;
 * the second refreshes via `$onUpdate`.
 *
 * @explanation
 * `createdAt` is set once at insertion and never mutated.
 * `updatedAt` is auto-refreshed by Drizzle's `$onUpdate`,
 * so passing it explicitly is unnecessary.
 *
 * @param entity - User domain entity.
 * @returns Update values for the row.
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(entity: User): Partial<typeof user.$inferInsert> {
  return {
    name: entity.name,
    email: entity.email,
    firstName: entity.firstName,
    lastName: entity.lastName,
    cpf: entity.cpf.value,
    role: entity.role,
    emailVerified: entity.emailVerified,
    image: entity.image,
  }
}
