import type { PaginationMeta } from "./envelope";
import type { PaginationQuery } from "./schemas";

/**
 * The resolved offset/limit view of a pagination query.
 */
export interface PageBounds {
  page: number;
  pageSize: number;
  offset: number;
}

/**
 * Derives limit/offset values from a pagination query.
 *
 * @param query - The validated pagination query.
 * @returns The page bounds.
 */
export function pageBounds(query: PaginationQuery): PageBounds {
  const offset = (query.page - 1) * query.pageSize;
  return { page: query.page, pageSize: query.pageSize, offset };
}

/**
 * Builds pagination metadata for a listing the repository pages.
 *
 * Because the repository performs the `LIMIT/OFFSET`, the metadata uses a
 * bounded-snapshot total (`offset + returned`) rather than a global count.
 *
 * @param options - The page bounds and the returned items.
 * @returns The pagination metadata.
 */
export function snapshotPaginationMeta({
  page,
  pageSize,
  offset,
  returned,
}: PageBounds & { returned: number }): PaginationMeta {
  const totalItems = offset + returned;
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  };
}

/**
 * Computes the bounds to slice an in-memory collection.
 *
 * @param all - The full collection returned by the use case.
 * @param query - The validated pagination query.
 * @returns The page slice and its precise metadata.
 */
export function slicePage<T>(
  all: T[],
  query: PaginationQuery,
): { items: T[]; meta: PaginationMeta } {
  const bounds = pageBounds(query);
  const items = all.slice(bounds.offset, bounds.offset + bounds.pageSize);
  const totalPages = Math.max(1, Math.ceil(all.length / bounds.pageSize));
  return {
    items,
    meta: {
      page: bounds.page,
      pageSize: bounds.pageSize,
      totalItems: all.length,
      totalPages,
    },
  };
}
