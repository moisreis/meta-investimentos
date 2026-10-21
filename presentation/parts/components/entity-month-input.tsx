"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/presentation/ui/combobox"

/**
 * One month of the month picker.
 */
interface MonthOption {
  // Zero-based month index, kept so the key can be rebuilt
  // without parsing the label back.
  index: number

  // Month name rendered to the user.
  label: string
}

// Month names from January to December, in reading order.
const MONTH_OPTIONS: readonly MonthOption[] = [
  { index: 0, label: "Janeiro" },
  { index: 1, label: "Fevereiro" },
  { index: 2, label: "Março" },
  { index: 3, label: "Abril" },
  { index: 4, label: "Maio" },
  { index: 5, label: "Junho" },
  { index: 6, label: "Julho" },
  { index: 7, label: "Agosto" },
  { index: 8, label: "Setembro" },
  { index: 9, label: "Outubro" },
  { index: 10, label: "Novembro" },
  { index: 11, label: "Dezembro" },
]

// Number of years offered before and after the current year,
// so the picker reaches a few periods of history and one year
// ahead without becoming an endless list.
const YEAR_RANGE = 6

/**
 * Props for the month picker.
 */
export interface EntityMonthInputProps {
  // Id linked to the field label.
  id: string

  // Name of the field.
  name: string

  // The selected `yyyy-MM` key.
  value: string

  // Reports the next `yyyy-MM` key.
  onValueChange?: (value: string) => void

  // Copy while nothing is set.
  placeholder: string

  // Marks the field as required.
  required?: boolean

  // Blocks the interaction.
  disabled?: boolean

  // Marks the field as invalid.
  "aria-invalid"?: boolean | "true" | "false"

  // Accessible label of the picker.
  gridLabel: string

  // First year offered by the year picker. Defaults to a few
  // years before the current one.
  yearFrom?: number

  // Last year offered by the year picker. Defaults to the
  // current year plus one.
  yearTo?: number
}

// Splits a `yyyy-MM` key into its parts, or null when the key
// does not match the month contract.
function ParseMonthValue(
  value: string
): { year: number; month: number } | null {
  const MATCH = value.match(/^(\d{4})-(\d{2})$/)
  if (!MATCH) return null

  const YEAR = Number(MATCH[1])
  const MONTH = Number(MATCH[2]) - 1

  if (MONTH < 0 || MONTH > 11) return null

  return { year: YEAR, month: MONTH }
}

// Builds the `yyyy-MM` key from a year and a zero-based month.
function ToMonthKey(year: number, month: number): string {
  const MONTH = String(month + 1).padStart(2, "0")
  return `${year}-${MONTH}`
}

/**
 * @summary
 * Renders a picker whose value is a whole month.
 *
 * @remarks
 * Composes two searchable comboboxes side by side: one for
 * the month, from Janeiro to Dezembro, and one for the year.
 * The pair replaces the day grid of the calendar variants, so
 * choosing a reporting period no longer asks for a day that
 * the value then discards.
 *
 * The value contract stays `yyyy-MM`, so a form schema, a
 * generate action and a period helper that read a month key
 * are untouched by picking this control. A partial selection,
 * a month without a year or the reverse, is reported as an
 * empty string so a required schema keeps rejecting it until
 * both halves are chosen.
 *
 * @explanation
 * Use for a field whose value is a reporting period rather
 * than a day, such as the reference month of a statement. The
 * copy is passed in rather than read from a settings file, so
 * a part stays independent of the route that uses it.
 *
 * @param props - Props of the month input.
 * @param props.id - Id linked to the field label.
 * @param props.name - Name of the field.
 * @param props.value - The selected `yyyy-MM` key.
 * @param props.onValueChange - Reports the next key.
 * @param props.placeholder - Copy while nothing is set.
 * @param props.required - Marks the field as required.
 * @param props.disabled - Blocks the interaction.
 * @param props.aria-invalid - Marks the field as invalid.
 * @param props.gridLabel - Accessible label of the picker.
 * @param props.yearFrom - First year offered.
 * @param props.yearTo - Last year offered.
 *
 * @returns The month picker.
 *
 * @example
 * <EntityMonthInput
 *   id="month"
 *   name="month"
 *   value={month}
 *   onValueChange={updateMonth}
 *   placeholder={STATEMENT_DIALOG.FIELD_MONTH_PLACEHOLDER}
 *   gridLabel={STATEMENT_DIALOG.FIELD_MONTH_GRID_LABEL}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function EntityMonthInput({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
  gridLabel,
  yearFrom,
  yearTo,
}: EntityMonthInputProps) {
  const CURRENT_YEAR = new Date().getFullYear()
  const FROM = yearFrom ?? CURRENT_YEAR - YEAR_RANGE
  const TO = yearTo ?? CURRENT_YEAR + 1

  const SELECTED = ParseMonthValue(value)

  const YEAR_OPTIONS = React.useMemo(() => {
    const OPTIONS: { id: string; name: string }[] = []
    for (let year = TO; year >= FROM; year -= 1) {
      OPTIONS.push({ id: String(year), name: String(year) })
    }
    return OPTIONS
  }, [FROM, TO])

  const MONTH_ITEMS = React.useMemo(
    () =>
      MONTH_OPTIONS.map((option) => ({
        id: String(option.index),
        name: option.label,
      })),
    []
  )

  const SELECTED_MONTH = SELECTED
    ? (MONTH_ITEMS[SELECTED.month] ?? null)
    : null
  const SELECTED_YEAR = SELECTED
    ? (YEAR_OPTIONS.find(
        (option) => option.id === String(SELECTED.year)
      ) ?? null)
    : null

  function EmitMonth(monthIndex: number, year: number) {
    onValueChange?.(ToMonthKey(year, monthIndex))
  }

  return (
    <div className="flex gap-2">
      <Combobox
        items={MONTH_ITEMS}
        value={SELECTED_MONTH}
        onValueChange={(next) => {
          if (!next) return
          EmitMonth(Number(next.id), SELECTED?.year ?? FROM)
        }}
        itemToStringLabel={(item) => item.name}
        itemToStringValue={(item) => item.id}
        isItemEqualToValue={(item, selected) =>
          item.id === selected.id
        }
        filter={(item, query) => {
          const NORMALIZED = query.trim().toLowerCase()
          if (!NORMALIZED) return true
          return item.name.toLowerCase().includes(NORMALIZED)
        }}
        autoHighlight
      >
        <ComboboxInput
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-label={gridLabel}
          className="flex-1"
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum mês encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.id} value={item}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Combobox
        items={YEAR_OPTIONS}
        value={SELECTED_YEAR}
        onValueChange={(next) => {
          if (!next) return
          EmitMonth(SELECTED?.month ?? 0, Number(next.id))
        }}
        itemToStringLabel={(item) => item.name}
        itemToStringValue={(item) => item.id}
        isItemEqualToValue={(item, selected) =>
          item.id === selected.id
        }
        filter={(item, query) => {
          const NORMALIZED = query.trim()
          if (!NORMALIZED) return true
          return item.name.includes(NORMALIZED)
        }}
        autoHighlight
      >
        <ComboboxInput
          name={`${name}Year`}
          placeholder="Ano"
          required={required}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-label="Ano de referência"
          className="w-24"
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum ano encontrado.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.id} value={item}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export { EntityMonthInput }
