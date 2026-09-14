import { ValidationError } from "@/errors"

// Regular expression to validate RFC 4122 UUID v4 strings.
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Unique symbol branding key for nominal type safety.
declare const __ENTITY_ID: unique symbol

/**
 * Nominal type alias representing a validated UUID **EntityId**.
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
 * **EntityId** values and test equality. Ensures all
 * entity identifiers across the domain adhere to UUID
 * formatting standards.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export const EntityId = {
  /**
   * @summary
   * Creates and validates a new nominal **EntityId**.
   *
   * @remarks
   * Trims whitespace and converts valid UUID strings to
   * lowercase before applying the nominal type brand.
   *
   * @explanation
   * Use this factory method to safely instantiate an
   * **EntityId** from a raw string. Throws a
   * **ValidationError** if the value is missing, empty,
   * or not a valid UUID.
   *
   * @param value - Raw UUID string to parse and validate.
   *
   * @returns Validated lowercase EntityId.
   *
   * @example
   * const ID = EntityId.create(
   *   "123e4567-e89b-42d3-a456-426614174000"
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  create(value: string): EntityId {
    if (value === undefined || value === null) {
      throw new ValidationError("EntityId must be defined.")
    }

    if (value.trim() === "") {
      throw new ValidationError("`EntityId` must not be blank.")
    }

    // Validates trimmed UUID string against RFC pattern.
    if (!UUID_REGEX.test(value.trim())) {
      throw new ValidationError("`EntityId` must be a valid UUID.")
    }

    // Returns normalized lowercase branded EntityId string.
    return value.trim().toLowerCase() as EntityId
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
   *
   * @param a - First **EntityId** instance to compare.
   * @param b - Second **EntityId** instance to compare.
   *
   * @returns True if both identifiers are identical.
   *
   * @example
   * const IS_SAME = EntityId.equals(idA, idB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  equals(a: EntityId, b: EntityId): boolean {
    return a === b
  },
}
