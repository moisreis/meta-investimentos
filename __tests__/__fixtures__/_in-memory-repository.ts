import type { EntityId } from "@/business/value-objects/entity-id.vo";

export function createInMemoryRepository<T extends object>(options: {
  extractId: (entity: T) => string | undefined;
}) {
  const ROWS = new Map<string, T>();

  return {
    rows(): IterableIterator<T> {
      return ROWS.values();
    },

    match(predicate: (entity: T) => boolean): T[] {
      const MATCHES: T[] = [];

      for (const ROW of ROWS.values()) {
        if (predicate(ROW)) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    findOne(predicate: (entity: T) => boolean): T | null {
      for (const ROW of ROWS.values()) {
        if (predicate(ROW)) return ROW;
      }

      return null;
    },

    async findById(id: EntityId): Promise<T | null> {
      return ROWS.get(id) ?? null;
    },

    async save(entity: T): Promise<T> {
      const KEY = options.extractId(entity) ?? "generated-id";

      ROWS.set(KEY, entity);

      return entity;
    },

    async delete(id: EntityId): Promise<void> {
      ROWS.delete(id);
    },
  };
}
