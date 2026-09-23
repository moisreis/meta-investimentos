"use client"

import * as React from "react"

import { SharedAddDialog } from "@/presentation/shared/dialogs/shared-add-dialog"
import { SharedEditDialog } from "@/presentation/shared/dialogs/shared-edit-dialog"
import { SharedEditTableButton } from "@/presentation/shared/components/shared-edit-table-button"
import { SharedToolbar } from "@/presentation/shared/components/shared-toolbar"
import { SharedToolbarSeparator } from "@/presentation/shared/components/shared-toolbar-separator"
import { SharedDataTable } from "@/presentation/shared/datatable/shared-datatable"
import { useEntityColumns } from "@/presentation/shared/hooks/use-entity-columns.hook"
import { useEntityDataTable } from "@/presentation/shared/hooks/use-entity-datatable.hook"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { PortfolioForm } from "../forms/portfolio-form"
import { useCreatePortfolio } from "../hooks/use-create-portfolio.hook"
import { useUpdatePortfolio } from "../hooks/use-update-portfolio.hook"
import { toPortfolioFormInitialValues } from "../mappers/portfolio-form.mapper"
import type { PortfolioFormValues } from "../validations/portfolio-form.validations"
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
  const [editingPortfolio, setEditingPortfolio] =
    React.useState<PortfolioResponseDTO | null>(null)

  const { createPortfolio } = useCreatePortfolio()
  const { updatePortfolio } = useUpdatePortfolio()

  const columns = useEntityColumns({
    columns: portfolioDataTableColumns,
    actions: portfolioDataTableActions.map((action) =>
      action.key === "edit"
        ? {
            ...action,
            onClick: (row: PortfolioResponseDTO) => setEditingPortfolio(row),
          }
        : action
    ),
  })

  const table = useEntityDataTable({
    data,
    columns,
    getRowId: (row) => row.id,
    pinnedStart: portfolioDataTablePinning.start,
    pinnedEnd: portfolioDataTablePinning.end,
  })

  const handleEditDialogOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      setEditingPortfolio(null)
    }
  }, [])

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
            <SharedAddDialog
              form={<PortfolioForm />}
              onAdd={createPortfolio}
              itemLabel="carteira"
            />
          </>
        }
      />
      <SharedDataTable table={table} />

      <SharedEditDialog<PortfolioResponseDTO, PortfolioFormValues>
        open={Boolean(editingPortfolio)}
        onOpenChange={handleEditDialogOpenChange}
        item={editingPortfolio}
        renderForm={(item) => (
          <PortfolioForm
            initialValues={toPortfolioFormInitialValues(item)}
            submitButtonLabel="Salvar alterações"
          />
        )}
        onEdit={(item, values) => updatePortfolio(item.id, values)}
      />
    </>
  )
}

export { PortfolioDataTable }