import { ValidationError } from "@/errors"

// Unique symbol branding key for nominal type safety.
declare const __ENTITY_ID: unique symbol

/**
 * Nominal type alias representing a validated opaque **EntityId**.
 */
export type EntityId = string & {
  readonly [__ENTITY_ID]: never
}

/**
 * @summary
 * Factory module for creating and comparing **EntityId** instances.
 *
 * @remarks
 * Encapsulates validation and normalization logic for unique entity
 * identifiers using nominal typing.
 *
 * @explanation
 * Provides static utility methods to construct valid
 * **EntityId** values and test equality. Accepts opaque
 * identifiers, matching the non-UUID ids persisted by
 * **Better-Auth** for users, sessions and accounts.
 * Use it when domain logic requires type-safe entity
 * references aligned with persistence layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export const EntityId = {
  /**
   * @summary
   * Creates and validates a new nominal **EntityId**.
   *
   * @remarks
   * Trims whitespace before applying the nominal type brand.
   * Opaque identifiers such as **Better-Auth** ids pass
   * validation, keeping the domain aligned with persistence.
   *
   * @explanation
   * Use this factory method to safely instantiate an
   * **EntityId** from a raw string. Throws a
   * **ValidationError** if the value is missing or blank.
   * Call it when converting persistence identifiers to
   * domain value objects.
   *
   * @param value - Raw identifier string to parse and validate.
   * @returns Branded EntityId string.
   *
   * @example
   * const ID = EntityId.create(
   *   "a3f6c9d2e0b14a2f9c6e7a1b2c3d4e5f"
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  create(value: string): EntityId {
    if (value === undefined || value === null) {
      throw new ValidationError("`EntityId` must be defined.")
    }

    // Trims the raw identifier before validation.
    const trimmed = value.trim()

    if (trimmed === "") {
      throw new ValidationError("`EntityId` must not be blank.")
    }

    // Returns the trimmed branded EntityId string.
    return trimmed as EntityId
  },

  /**
   * @summary
   * Compares two **EntityId** instances for equality.
   *
   * @remarks
   * Performs direct string identity comparison.
   *
   * @explanation
   * Use this method to check whether two nominal entity
   * identifier values refer to the same domain entity.
   * Call it when comparing entity references in domain logic.
   *
   * @param a - First **EntityId** instance to compare.
   * @param b - Second **EntityId** instance to compare.
   * @returns True if both ids match.
   *
   * @example
   * const IS_SAME = EntityId.equals(idA, idB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  equals(a: EntityId, b: EntityId): boolean {
    return a === b
  },
}