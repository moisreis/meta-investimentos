"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/presentation/ui/combobox"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/presentation/ui/item"

import { WITHDRAWAL_FORM } from "../settings/labels.settings"

// Option rendered by the withdrawal portfolio combobox.
export interface WithdrawalPortfolioComboboxItem {
  // Id submitted to the form.
  id: string
  // Primary text rendered in the list and the input.
  name: string
  // Secondary text rendered under the name.
  description?: string
}

interface WithdrawalPortfolioComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  items: WithdrawalPortfolioComboboxItem[]
  required?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}

/**
 * @summary
 * Renders the portfolio picker of the add withdrawal form.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected portfolio is synced to the form as a string
 * id. Each option carries the portfolio acronym under its
 * name, so the picker shows the same two-line display of
 * the `Carteira` column of the datatables.
 *
 * @explanation
 * Use for the portfolio field of the add withdrawal form.
 * The selection narrows the position picker down to the
 * positions of that portfolio. Pass the display options
 * through `items` and read the selection through
 * `onValueChange`.
 *
 * @param props - Props of the portfolio combobox.
 * @param props.items - The portfolio options.
 * @param props.onValueChange - Reports the picked portfolio.
 *
 * @returns The portfolio combobox.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function WithdrawalPortfolioCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  items,
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: WithdrawalPortfolioComboboxProps) {
  const SELECTED =
    items.find((item) => item.id === value) ?? null

  return (
    <Combobox
      items={items}
      value={SELECTED}
      onValueChange={(next) =>
        onValueChange(next ? next.id : "")
      }
      itemToStringLabel={(item) => item.name}
      itemToStringValue={(item) => item.id}
      isItemEqualToValue={(item, selected) =>
        item.id === selected.id
      }
      filter={(item, query) => {
        const NORMALIZED = query.trim().toLowerCase()
        if (!NORMALIZED) return true
        const HAYSTACK =
          `${item.name} ${item.description ?? ""}`.toLowerCase()
        return HAYSTACK.includes(NORMALIZED)
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
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {WITHDRAWAL_FORM.SEARCH_EMPTY_PORTFOLIO}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {item.name}
                  </ItemTitle>
                  {item.description ? (
                    <ItemDescription className="whitespace-nowrap">
                      {item.description}
                    </ItemDescription>
                  ) : null}
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { WithdrawalPortfolioCombobox }
