"use client"

import { IconUsers } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { UserRow } from "@/presentation/types/user-row.types"

import { UserDatatableFilters } from "../datatable/filters"
import { UserDatatableTable } from "../datatable/table"
import { UserDatatableToolbar } from "../datatable/toolbar"
import { UserAddDialog } from "../dialogs/add"
import { UserConfirmDeleteDialog } from "../dialogs/confirm-delete"
import { UserEditDialog } from "../dialogs/edit"
import { useUserDatatableFilters } from "../hooks/use-user-datatable-filters.hook"
import { useUserDatatable } from "../hooks/use-user-datatable.hook"
import { useUserKpis } from "../hooks/use-user-kpis.hook"
import { USER_EMPTY } from "../settings/labels.settings"

export interface UserListProps {
  data: UserRow[] | null
}

/**
 * @summary
 * Renders the user list page.
 *
 * @remarks
 * Composes the KPI group, the toolbar with the search
 * filter, the empty state and the datatable. The KPIs
 * are read off the rows alone, so the screen needs no
 * extra query beyond the list itself.
 *
 * @param props - Props of the user list page.
 * @param props.data - The user rows, or `null` while
 *                     loading.
 *
 * @returns The user list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function UserList({ data }: UserListProps) {
  const USERS = data ?? []
  const HAS_USERS = USERS.length > 0

  const filters = useUserDatatableFilters(USERS)
  const {
    table,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  } = useUserDatatable(filters.filteredUsers)
  const kpis = useUserKpis({ users: USERS })

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

      <UserDatatableToolbar
        table={table}
        onAddItem={addDialog.handleOpen}
        filters={
          <UserDatatableFilters
            query={filters.query}
            onQueryChange={filters.onQueryChange}
          />
        }
      />

      {HAS_USERS ? (
        <UserDatatableTable
          table={table}
          onBulkDelete={bulkDelete.handleBulkDelete}
        />
      ) : (
        <EntityEmptyTable
          icon={IconUsers}
          title={USER_EMPTY.TITLE}
          description={USER_EMPTY.DESCRIPTION}
          primaryActionLabel={USER_EMPTY.PRIMARY_ACTION_LABEL}
          onPrimaryAction={addDialog.handleOpen}
        />
      )}

      <UserAddDialog dialog={addDialog} />
      <UserEditDialog dialog={editDialog} />
      <UserConfirmDeleteDialog dialog={rowActions} />
    </>
  )
}

export { UserList }
