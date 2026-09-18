import {
  columnPinningFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from "@tanstack/react-table"

export const features = tableFeatures({
  columnPinningFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnMeta: {} as { width?: number; align?: "start" | "end" },
})

export type SharedDataTableFeatures = typeof features
