import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Creates an in-memory repository for a specific entity type.
 *
 * This factory provides a simple, Map-based storage solution
 * primarily intended for testing, prototyping, or scenarios
 * where persistent database storage is not required.
 *
 * An in-memory repository:
 * - stores entities in a `Map` using extracted IDs as keys.
 * - provides synchronous utility methods for iteration and filtering.
 * - provides asynchronous methods simulating standard database operations.
 *
 * @param options - Configuration object for the repository.
 * @param options.extractId - A function that extracts the unique
 *   identifier string from an entity. If no ID is returned, it
 *   defaults to `"generated-id"`.
 * @returns An object containing the repository methods.
 *
 * @example
 * ```ts
 * const userRepository = createInMemoryRepository<User>({
 *   extractId: (user) => user.id
 * })
 *
 * await userRepository.save({ id: '123', name: 'Alice' })
 * ```
 */
export function createInMemoryRepository<T extends object>(options: {
  extractId: (entity: T) => string | undefined;
}) {
  const ROWS = new Map<string, T>();

  return {
    /**
     * Returns an iterator over all entities currently in the repository.
     *
     * @returns An iterable iterator of the stored entities.
     */
    rows(): IterableIterator<T> {
      return ROWS.values();
    },

    /**
     * Finds all entities that satisfy the provided predicate function.
     *
     * @param predicate - A function to evaluate each entity.
     * @returns An array of all entities for which the predicate
     *   returns `true`.
     *
     * @example
     * ```ts
     * const activeUsers = repository.match(user => user.isActive)
     * ```
     */
    match(predicate: (entity: T) => boolean): T[] {
      const MATCHES: T[] = [];

      for (const ROW of ROWS.values()) {
        if (predicate(ROW)) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    /**
     * Finds the first entity that satisfies the provided predicate function.
     *
     * @param predicate - A function to evaluate each entity.
     * @returns The first matching entity if one exists;
     *   otherwise, `null`.
     */
    findOne(predicate: (entity: T) => boolean): T | null {
      for (const ROW of ROWS.values()) {
        if (predicate(ROW)) return ROW;
      }

      return null;
    },

    /**
     * Retrieves all entities stored in the repository.
     *
     * @returns A promise that resolves to an array of all entities.
     */
    async findAll(): Promise<T[]> {
      return [...ROWS.values()];
    },

    /**
     * Retrieves an entity by its unique identifier.
     *
     * @param id - The ID of the entity to search for.
     * @returns A promise that resolves to the entity if found;
     *   otherwise, `null`.
     */
    async findById(id: EntityId): Promise<T | null> {
      return ROWS.get(id) ?? null;
    },

    /**
     * Saves or updates an entity in the repository.
     *
     * If an entity with the same ID already exists, it will be
     * overwritten. If the `extractId` function returns undefined,
     * a fallback key of `"generated-id"` is used.
     *
     * @param entity - The entity to be saved.
     * @returns A promise that resolves to the saved entity.
     *
     * @example
     * ```ts
     * const savedUser = await repository.save(newUser)
     * ```
     */
    async save(entity: T): Promise<T> {
      const KEY = options.extractId(entity) ?? "generated-id";

      ROWS.set(KEY, entity);

      return entity;
    },

    /**
     * Removes an entity from the repository by its ID.
     *
     * @param id - The ID of the entity to be deleted.
     * @returns A promise that resolves when the operation is complete.
     */
    async delete(id: EntityId): Promise<void> {
      ROWS.delete(id);
    },
  };
}