"use client"

import { SharedAddItemButton } from "@/presentation/shared/components/shared-add-item-button"
import { SharedEditTableButton } from "@/presentation/shared/components/shared-edit-table-button"
import { SharedToolbar } from "@/presentation/shared/components/shared-toolbar"
import { SharedToolbarSeparator } from "@/presentation/shared/components/shared-toolbar-separator"
import { SharedDataTable } from "@/presentation/shared/datatable/shared-datatable"
import { useEntityColumns } from "@/presentation/shared/hooks/use-entity-columns.hook"
import { useEntityDataTable } from "@/presentation/shared/hooks/use-entity-datatable.hook"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import {
  portfolioDataTableActions,
  portfolioDataTableColumnLabels,
  portfolioDataTableColumns,
  portfolioDataTablePinning,
} from "../settings/portfolio-datatable-columns.settings"

interface PortfolioDataTableProps {
  data: PortfolioResponseDTO[]
}

function PortfolioDataTable({ data }: PortfolioDataTableProps) {
  const columns = useEntityColumns({
    columns: portfolioDataTableColumns,
    actions: portfolioDataTableActions,
  })

  const table = useEntityDataTable({
    data,
    columns,
    getRowId: (row) => row.id,
    pinnedStart: portfolioDataTablePinning.start,
    pinnedEnd: portfolioDataTablePinning.end,
  })

  return (
    <>
      <SharedToolbar
        filters={<></>}
        actions={
          <>
            <SharedEditTableButton
              table={table}
              getColumnLabel={(column) =>
                portfolioDataTableColumnLabels[column.id] ?? column.id
              }
            />
            <SharedToolbarSeparator />
            <SharedAddItemButton />
          </>
        }
      />
      <SharedDataTable table={table} />
    </>
  )
}

export { PortfolioDataTable }
