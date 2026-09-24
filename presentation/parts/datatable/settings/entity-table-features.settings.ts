import {
  columnFilteringFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table"
import type {
  Cell,
  Column,
  Header,
  ReactTable,
  Row,
  RowData,
} from "@tanstack/react-table"

// Register the features every entity data-table uses.
// Anything not listed here is tree-shaken from the bundle.
export const ENTITY_TABLE_FEATURES = tableFeatures({
  columnFilteringFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  // Phantom slot that declares the column metadata contract.
  columnMeta: {} as {
    align?: "start" | "end"
    pinned?: "start" | "end"
  },
})

// Features type used as the first generic of every table type.
export type EntityTableFeatures = typeof ENTITY_TABLE_FEATURES

// Table instance bound to the entity table features.
export type EntityTable<TData extends RowData> = ReactTable<
  EntityTableFeatures,
  TData
>

// Column instance bound to the entity table features.
export type EntityColumn<TData extends RowData> = Column<
  EntityTableFeatures,
  TData,
  unknown
>

// Cell instance bound to the entity table features.
export type EntityCell<TData extends RowData> = Cell<
  EntityTableFeatures,
  TData,
  unknown
>

// Header instance bound to the entity table features.
export type EntityHeader<TData extends RowData> = Header<
  EntityTableFeatures,
  TData,
  unknown
>

// Row instance bound to the entity table features.
export type EntityRow<TData extends RowData> = Row<
  EntityTableFeatures,
  TData
>
