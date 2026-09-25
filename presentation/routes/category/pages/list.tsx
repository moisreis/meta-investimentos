"use client"

import { IconCategory } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

import { CategoryDatatableFilters } from "../datatable/filters"
import { CategoryDatatableTable } from "../datatable/table"
import { CategoryDatatableToolbar } from "../datatable/toolbar"
import { CategoryAddDialog } from "../dialogs/add"
import { CategoryConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { CategoryEditDialog } from "../dialogs/edit"
import { useCategoryDatatableFilters } from "../hooks/use-category-datatable-filters.hook"
import { useCategoryDatatable } from "../hooks/use-category-datatable.hook"
import { useCategoryKpis } from "../hooks/use-category-kpis.hook"
import { CATEGORY_EMPTY } from "../settings/labels.settings"
import type { CategoryRowSummary } from "../types/category-list.types"

interface CategoryListProps {
  data: CategoryResponseDTO[] | null
  summaries?: Record<string, CategoryRowSummary> | null
}

function CategoryList({
  data,
  summaries = null,
}: CategoryListProps) {
  const CATEGORIES = data ?? []
  const HAS_CATEGORIES = CATEGORIES.length > 0

  const filters = useCategoryDatatableFilters(CATEGORIES)
  const {
    table,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  } = useCategoryDatatable(filters.filteredCategories, summaries)
  const kpis = useCategoryKpis({
    categories: CATEGORIES,
    summaries,
  })

  return (
    <>
      <EntityDatatableKpiGroup>
        {kpis.map((kpi) => (
          <EntityDatatableKpiCard
            key={kpi.key}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            comparison={kpi.comparison}
            dotIndicator={kpi.dotIndicator}
            icon={kpi.icon}
          />
        ))}
      </EntityDatatableKpiGroup>

      <CategoryDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <CategoryDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {HAS_CATEGORIES ? (
        <CategoryDatatableTable
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconCategory}
          title={CATEGORY_EMPTY.TITLE}
          description={CATEGORY_EMPTY.DESCRIPTION}
          primaryActionLabel={
            CATEGORY_EMPTY.PRIMARY_ACTION_LABEL
          }
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <CategoryAddDialog dialog={addDialog} />
      <CategoryEditDialog dialog={editDialog} />
      <CategoryConfirmDeleteDialog dialog={rowActions} />
    </>
  )
}

export { CategoryList }
