import type { CvmImportWindow } from "@/services/quota/use-cases/import-fund-valuations.use-case"

export interface QuotaImportWindowOption {
  value: CvmImportWindow
  label: string
  description: string
}

// Import windows offered by the confirm dialog.
export const QUOTA_IMPORT_WINDOWS: readonly QuotaImportWindowOption[] =
  [
    {
      value: "today",
      label: "Hoje",
      description: "Apenas as cotações de hoje.",
    },
    {
      value: "week",
      label: "Última semana",
      description: "Cotações dos últimos sete dias.",
    },
    {
      value: "month",
      label: "Mês atual",
      description: "Desde o primeiro dia do mês.",
    },
    {
      value: "year-to-date",
      label: "Ano atual",
      description: "Desde o primeiro dia do ano.",
    },
    {
      value: "last-2-months",
      label: "Últimos 2 meses",
      description: "Dois meses retroativos.",
    },
    {
      value: "last-6-months",
      label: "Últimos 6 meses",
      description: "Seis meses retroativos.",
    },
  ] as const

// Datatable copy for the quota list screen.
export const QUOTA_DATATABLE = {
  // Search filter placeholder.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por fundo, cnpj ou data",

  // Fund column header.
  COLUMN_FUND: "Fundo",

  // Date column header.
  COLUMN_DATE: "Data",

  // Price column header.
  COLUMN_PRICE: "Preço da cota",

  // Import action button label.
  IMPORT_BUTTON_LABEL: "Importar Cotas",
} as const

// Import flow copy.
export const QUOTA_IMPORT = {
  // Confirm dialog header.
  CONFIRM_TITLE: "Importar cotas",

  // Confirm dialog description.
  CONFIRM_DESCRIPTION:
    "Escolha o período para importar as cotas direto da CVM.",

  // Window field label.
  FIELD_WINDOW: "Período",

  // Window field description.
  FIELD_WINDOW_DESCRIPTION: "Intervalo dos dados a importar.",

  // Confirm button content.
  CONFIRM_BUTTON: "Importar",

  // Confirm pending button content.
  CONFIRM_PENDING_BUTTON: "Preparando importação",

  // Cancel button content.
  CANCEL_BUTTON: "Cancelar",

  // Start error generic label.
  START_ERROR: "Não foi possível iniciar a importação.",

  // Progress dialog header while running.
  PROGRESS_TITLE: "Importando cotas",

  // Progress dialog description while running.
  PROGRESS_DESCRIPTION:
    "Buscando e gravando as cotações da CVM.",

  // Running status marker content.
  PROGRESS_RUNNING_LABEL: "Processando arquivos da CVM...",

  // Progress dialog header on success.
  SUCCESS_TITLE: "Importação concluída",

  // Progress dialog description on success.
  SUCCESS_DESCRIPTION: "As cotas do período foram importadas.",

  // Imported rows summary label.
  ROWS_IMPORTED_LABEL: "cotas importadas",

  // Skipped rows summary label.
  SKIPPED_LABEL: "registros ignorados",

  // Done button content.
  DONE_BUTTON: "Concluir",

  // Progress dialog header on error.
  ERROR_TITLE: "Falha na importação",

  // Progress dialog description on error.
  ERROR_DESCRIPTION: "Não foi possível concluir a importação.",

  // Close button content.
  CLOSE_BUTTON: "Fechar",
} as const

// KPI copy for the quota list.
export const QUOTA_KPI = {
  // Total quotas KPI title.
  ROW_COUNT_TITLE: "Cotas",

  // Total quotas KPI comparison.
  ROW_COUNT_COMPARISON: "cotas importadas",

  // Funds KPI title.
  FUND_COUNT_TITLE: "Fundos",

  // Funds KPI comparison.
  FUND_COUNT_COMPARISON: "fundos vinculados",

  // Latest date KPI title.
  LAST_DATE_TITLE: "Última cota",

  // Latest date KPI comparison.
  LAST_DATE_COMPARISON: "data mais recente",
} as const

// Empty state copy for the quota list.
export const QUOTA_EMPTY = {
  TITLE: "Nenhuma cota importada",
  DESCRIPTION:
    "Importe as cotações de um período direto da CVM.",
  PRIMARY_ACTION_LABEL: "Importar cotas",
} as const
