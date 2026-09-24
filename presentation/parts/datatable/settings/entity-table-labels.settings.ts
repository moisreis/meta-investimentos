// Copy, styles and constants for the entity data-table
// components. Follows the pt-BR interface language of
// the application.

// Empty-state message shown when the table has no rows.
export const ENTITY_TABLE_EMPTY_STATE_LABEL =
  "Nenhum registro encontrado."

// Background used by the sticky header row.
export const ENTITY_TABLE_HEADER_BG = "bg-background"

// Page sizes offered by the pagination dropdown.
export const ENTITY_TABLE_PAGE_SIZES = [
  10, 20, 30, 40, 50,
] as const

// Copy for the selection column.
export const ENTITY_TABLE_SELECT_ALL_LABEL = "Selecionar todos"
export const ENTITY_TABLE_SELECT_ROW_LABEL = "Selecionar linha"

// Copy for the per-row actions menu.
export const ENTITY_TABLE_ROW_ACTIONS_LABEL = "Ações"

// Pagination copy.
export const ENTITY_TABLE_PAGE_PREFIX_LABEL = "Página"
export const ENTITY_TABLE_PREVIOUS_PAGE_LABEL = "Anterior"
export const ENTITY_TABLE_NEXT_PAGE_LABEL = "Próxima"

// Copy for the bulk delete dialog.
export const ENTITY_TABLE_BULK_DELETE_TITLE =
  "Excluir itens selecionados"
export const ENTITY_TABLE_BULK_DELETE_CONFIRM_LABEL = "Excluir"
export const ENTITY_TABLE_BULK_DELETE_CANCEL_LABEL = "Cancelar"

// Formats the pagination summary for the selected rows.
function FormatSelectedRowsLabel(
  selected: number,
  total: number
): string {
  return `${selected} de ${total} linha(s) selecionada(s).`
}

// Formats the page-size trigger label.
function FormatPageSizeLabel(size: number): string {
  return `${size} linhas`
}

// Formats a page-size dropdown option.
function FormatPageSizeDropdownLabel(size: number): string {
  return `${size} por página`
}

// Formats the bulk delete button label.
function FormatBulkDeleteButtonLabel(count: number): string {
  return `Excluir todos(as) os ${count} itens`
}

// Formats the bulk delete dialog description.
function FormatBulkDeleteDescription(count: number): string {
  return `Deseja excluir ${count} itens? Esta ação não pode ser desfeita.`
}

export {
  FormatBulkDeleteButtonLabel,
  FormatBulkDeleteDescription,
  FormatPageSizeDropdownLabel,
  FormatPageSizeLabel,
  FormatSelectedRowsLabel,
}
