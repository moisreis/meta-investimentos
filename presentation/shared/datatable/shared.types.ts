import type {
  Cell,
  Column,
  Header,
  ReactTable,
  RowData,
} from "@tanstack/react-table"

import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

/**
 * Table instance typing bound to the shared data-table features.
 */
export type SharedTable<TData extends RowData> = ReactTable<
  SharedDataTableFeatures,
  TData
>

/**
 * Column typing bound to the shared data-table features.
 */
export type SharedColumn<TData extends RowData> = Column<
  SharedDataTableFeatures,
  TData,
  unknown
>

/**
 * Header typing bound to the shared data-table features.
 */
export type SharedHeader<TData extends RowData> = Header<
  SharedDataTableFeatures,
  TData,
  unknown
>

/**
 * Cell typing bound to the shared data-table features.
 */
export type SharedCell<TData extends RowData> = Cell<
  SharedDataTableFeatures,
  TData,
  unknown
>