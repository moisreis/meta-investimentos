import { ValidationError } from "@/shared/errors";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * A branded string type representing a validated UUID identifier.
 *
 * `EntityId` is a lightweight domain primitive that ensures all
 * entity identifiers conform to the UUID v4 format. It is
 * assignable to `string` and works seamlessly with Drizzle ORM
 * queries, while providing compile-time type safety that prevents
 * mixing unrelated string values.
 *
 * Use {@link EntityId.create} to validate and produce an `EntityId`.
 *
 * @example
 * ```ts
 * const ID = EntityId.create('ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2')
 *
 * ID // 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2'
 * ```
 */
declare const __entityId: unique symbol;

export type EntityId = string & { readonly [__entityId]: never };

/**
 * Namespace providing factory and comparison methods for
 * {@link EntityId} values.
 *
 * @example
 * ```ts
 * const A = EntityId.create('ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2')
 * const B = EntityId.create('ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2')
 *
 * EntityId.equals(A, B)
 * // true
 * ```
 */
export const EntityId = {
  /**
   * Creates a valid `EntityId` from the provided string value.
   *
   * The value must be a valid UUID (v4 format). It is normalized
   * to lowercase before validation.
   *
   * @param value - The string value to validate as an `EntityId`.
   * @returns A validated `EntityId` instance.
   *
   * @throws {ValidationError} If `value` is `undefined` or `null`.
   * @throws {ValidationError} If `value` is blank.
   * @throws {ValidationError} If `value` is not a valid UUID.
   *
   * @example
   * ```ts
   * const ID = EntityId.create(
   *   'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2'
   * )
   * ```
   *
   * @example
   * ```ts
   * // Throws: not a valid UUID
   * EntityId.create('not-a-uuid')
   * ```
   */
  create(value: string): EntityId {
    if (value === undefined || value === null) {
      throw new ValidationError("`EntityId` must be defined.");
    }

    if (value.trim() === "") {
      throw new ValidationError("`EntityId` must not be blank.");
    }

    if (!UUID_REGEX.test(value.trim())) {
      throw new ValidationError("`EntityId` must be a valid UUID.");
    }

    return value.trim().toLowerCase() as EntityId;
  },

  /**
   * Determines whether two `EntityId` values represent the same
   * identifier.
   *
   * @param a - The first entity id.
   * @param b - The second entity id.
   * @returns `true` when both identifiers are equal; otherwise, `false`.
   *
   * @example
   * ```ts
   * const A = EntityId.create('ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2')
   * const B = EntityId.create('BA57AD33-3D94-4A4A-9A6F-B3F916F7B4A2')
   *
   * EntityId.equals(A, B)
   * // true
   * ```
   */
  equals(a: EntityId, b: EntityId): boolean {
    return a === b;
  },
};
