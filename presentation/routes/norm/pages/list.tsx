"use client"

import { IconScale } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { NormRow } from "@/presentation/types/norm-row.types"

import { NormDatatableFilters } from "../datatable/filters"
import { NormDatatableTable } from "../datatable/table"
import { NormDatatableToolbar } from "../datatable/toolbar"
import { NormAddDialog } from "../dialogs/add"
import { NormEditDialog } from "../dialogs/edit"
import { useNormDatatableFilters } from "../hooks/use-norm-datatable-filters.hook"
import { useNormDatatable } from "../hooks/use-norm-datatable.hook"
import { useNormKpis } from "../hooks/use-norm-kpis.hook"
import { NORM_EMPTY } from "../settings/labels.settings"
import type {
  NormNameLookups,
  NormSelectOptions,
} from "../types/norm-list.types"

export interface NormListProps {
  data: NormRow[] | null
  options: NormSelectOptions | null
  names: NormNameLookups
}

/**
 * @summary
 * Renders the norm list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the search
 * filter, the empty state and the datatable. The page
 * renders no markup of its own, so the blocks above the
 * table stay in the parts and the blocks below it stay
 * in the route components.
 *
 * @param props - Props of the norm list page.
 * @param props.data - The norm rows, or `null` while
 *                     loading.
 * @param props.options - The registry form options.
 * @param props.names - The category name lookups.
 *
 * @returns The norm list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function NormList({ data, options, names }: NormListProps) {
  const PENDING = data === null
  const NORMS = data ?? []
  const HAS_NORMS = NORMS.length > 0
  const OPTIONS = options ?? { categories: [] }

  const filters = useNormDatatableFilters(NORMS)
  const { table, addDialog, editDialog } = useNormDatatable(
    filters.filteredNorms,
    names
  )
  const kpis = useNormKpis(NORMS)

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

      <NormDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <NormDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {PENDING || HAS_NORMS ? (
        <NormDatatableTable pending={PENDING} table={table} />
      ) : (
        <EntityEmptyTable
          icon={IconScale}
          title={NORM_EMPTY.TITLE}
          description={NORM_EMPTY.DESCRIPTION}
          primaryActionLabel={NORM_EMPTY.PRIMARY_ACTION_LABEL}
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <NormAddDialog dialog={addDialog} options={OPTIONS} />
      <NormEditDialog dialog={editDialog} options={OPTIONS} />
    </>
  )
}

export { NormList }
