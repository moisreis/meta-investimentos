"use client"

import { IconCategory } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { CategoryRow } from "@/presentation/types/category-row.types"

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

export interface CategoryListProps {
  data: CategoryRow[] | null
  summaries?: Record<string, CategoryRowSummary> | null
}

/**
 * @summary
 * Renders the category list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the search
 * filter, the empty state and the datatable. The page
 * renders no markup of its own, so the blocks above the
 * table stay in the parts and the blocks below it stay
 * in the route components.
 *
 * @param props - Props of the category list page.
 * @param props.data - The category rows, or `null` while
 *                     loading.
 * @param props.summaries - The category summaries the
 *                          KPIs and the row actions read.
 *
 * @returns The category list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
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
