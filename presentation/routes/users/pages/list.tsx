"use client"

import { IconUsers } from "@tabler/icons-react"

import { EntityDatatableKpiCard } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { EntityDatatableKpiGroup } from "@/presentation/parts/components/entity-datatable-kpi-group"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

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

interface UsersListProps {
  data: UserResponseDTO[] | null
}

function UsersList({ data }: UsersListProps) {
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

export { UsersList }
