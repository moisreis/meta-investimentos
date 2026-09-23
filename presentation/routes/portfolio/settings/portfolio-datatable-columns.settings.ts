import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import {
  SHARED_ACTIONS_COLUMN_ID,
  SHARED_SELECT_COLUMN_ID,
  type SharedDataTableColumnConfig,
  type SharedDataTableRowAction,
} from "@/presentation/shared/settings/shared-datatable-columns.settings"

export const portfolioDataTableColumns: SharedDataTableColumnConfig<PortfolioResponseDTO>[] =
  [
    {
      id: "acronym",
      accessorKey: "acronym",
      label: "Sigla",
      width: 160,
    },
    {
      id: "name",
      accessorKey: "name",
      label: "Nome",
      width: 280,
    },
    {
      id: "ownerName",
      accessorKey: "ownerName",
      label: "Proprietário",
      cellFormat: "user",
      width: 280,
    },
    {
      id: "annualInterestRate",
      accessorKey: "annualInterestRate",
      label: "Taxa Anual",
      cellFormat: "percentage",
      align: "end",
      width: 120,
    },
    {
      id: "minAllocation",
      accessorKey: "minAllocation",
      label: "Alocação Mínima",
      cellFormat: "percentage",
      align: "end",
      width: 150,
    },
    {
      id: "targetAllocation",
      accessorKey: "targetAllocation",
      label: "Alocação Alvo",
      cellFormat: "percentage",
      align: "end",
      width: 140,
    },
    {
      id: "maxAllocation",
      accessorKey: "maxAllocation",
      label: "Alocação Máxima",
      cellFormat: "percentage",
      align: "end",
      width: 150,
    },
    {
      id: "totalPatrimony",
      accessorKey: "totalPatrimony",
      label: "Patrimônio Total",
      cellFormat: "percentage",
      align: "end",
      width: 150,
    },
    {
      id: "earnings",
      accessorKey: "earnings",
      label: "Ganhos Totais",
      cellFormat: "text",
      align: "end",
      width: 150,
    },
    {
      id: "return",
      accessorKey: "return",
      label: "Rendimento",
      cellFormat: "text",
      align: "end",
      width: 150,
    },
  ]

export const portfolioDataTableActions: SharedDataTableRowAction<PortfolioResponseDTO>[] =
  [
    {
      key: "view",
      label: "Ver",
      href: (row) => `/portfolio/${row.id}`,
    },
    {
      key: "edit",
      label: "Editar",
    },
    {
      key: "delete",
      label: "Excluir",
      variant: "destructive",
      separatorBefore: true,
    },
  ]

export const portfolioDataTablePinning: { start: string[]; end: string[] } = {
  start: [SHARED_SELECT_COLUMN_ID, "acronym"],
  end: [SHARED_ACTIONS_COLUMN_ID],
}

export const portfolioDataTableColumnLabels: Record<string, string> =
  portfolioDataTableColumns.reduce(
    (labels, column) => {
      labels[column.id] = column.label
      return labels
    },
    {} as Record<string, string>
  )
