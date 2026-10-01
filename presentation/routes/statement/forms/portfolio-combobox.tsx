"use client"
import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"

import { STATEMENT_DIALOG } from "../settings/labels.settings"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
interface StatementPortfolioComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  items: readonly EntityComboboxItem[]
  required?: boolean
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}
/**
 * @summary
 * Renders the portfolio picker of the statement generate
 * form.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected portfolio is synced to the form as a
 * string id. Each option carries the portfolio name as the
 * title and the acronym as the description.
 *
 * @explanation
 * Use for the portfolio field of the statement generate
 * form. Pass the display options through `items` and read
 * the selection through `onValueChange`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function StatementPortfolioCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  items,
  required,
  disabled,
  "aria-invalid": ariaInvalid,
  clearable,
}: StatementPortfolioComboboxProps) {
  return (
    <EntityCombobox
      id={id}
      name={name}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      items={items}
      required={required}
      disabled={disabled}
      clearable={clearable}
      emptyLabel={STATEMENT_DIALOG.FIELD_PORTFOLIO_PLACEHOLDER}
      aria-invalid={ariaInvalid}
    />
  )
}

export { StatementPortfolioCombobox }
