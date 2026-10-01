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

/**
 * One option of an entity combobox.
 *
 * @remarks
 * The three fields are the whole contract: `id` is what the
 * form receives, `name` is what the user reads, and
 * `description` is the qualifier under it. Every picker in the
 * app offers the same shape, so the shape belongs here rather
 * than being restated per module.
 */
export interface EntityComboboxItem {
  // Value submitted to the form.
  id: string

  // Primary text rendered in the list and the input.
  name: string

  // Secondary text rendered under the name. Omitted by the
  // pickers whose options have no qualifier, such as the role
  // picker.
  description?: string
}

/**
 * Props for the entity combobox.
 */
export interface EntityComboboxProps {
  // Id of the input, which the field label points at.
  id: string

  // Form name submitted with the value.
  name: string

  // The selected option's id, or the empty string when
  // nothing is selected.
  value: string

  // Reports the next selection as an id, or the empty string
  // when the field is cleared.
  onValueChange: (value: string) => void

  // Text shown in the input while nothing is selected.
  placeholder: string

  // The options offered, in the order they are listed.
  items: readonly EntityComboboxItem[]

  // Copy shown when no option matches the query.
  emptyLabel: string

  // Marks the field required, which also drops the clear
  // affordance.
  required?: boolean

  // Shows the control that removes the current choice back to
  // an empty value. Only for optional fields: a required one
  // has no empty state to return to.
  clearable?: boolean

  // Blocks interaction while the form is submitting.
  disabled?: boolean

  // Marks the field invalid for the screen reader.
  "aria-invalid"?: boolean | "true" | "false"
}

/**
 * @summary
 * Renders the searchable picker every route form uses to
 * choose one of many.
 *
 * @remarks
 * A form that points at another record, a fund, a portfolio, a
 * position, a bank, an account, a role, has to answer the same
 * four questions: how a choice is identified, how it is
 * labelled, how two choices are compared, and what a typed
 * query matches against. Answering them once is what keeps a
 * fund picker and a role picker feeling like the same control,
 * and it is what lets a new picker be written without
 * re-deciding any of it.
 *
 * The chosen option is reported to the form as a plain string
 * id, which is the shape the schemas already validate, so
 * picking an option replaces the previous choice and clearing
 * the field falls back to the empty string a required schema
 * rejects.
 *
 * `description` is optional rather than a second variant: a
 * picker without qualifiers simply omits it, and the search
 * then matches the name alone. One picker with one branch is
 * cheaper than two that drift.
 *
 * @explanation
 * Use for any form field that chooses one record out of
 * many. Build the options in the route, pass them as `items`,
 * and read the choice through `onValueChange`.
 *
 * @param props - Props of the entity combobox.
 * @param props.id - Id of the input.
 * @param props.name - Form name submitted with the value.
 * @param props.value - The selected option's id.
 * @param props.onValueChange - Reports the next selection.
 * @param props.placeholder - Input placeholder.
 * @param props.items - The options offered.
 * @param props.emptyLabel - Copy shown when nothing matches.
 * @param props.required - Marks the field required.
 * @param props.clearable - Shows the control that empties the
 *   field.
 * @param props.disabled - Blocks interaction.
 * @param props.ariaInvalid - Marks the field invalid.
 *
 * @returns The entity combobox.
 *
 * @example
 * <EntityCombobox
 *   id="fundId"
 *   name="fundId"
 *   value={fundId}
 *   onValueChange={onFundIdChange}
 *   placeholder={APPLICATION_FORM.FIELD_FUND_PLACEHOLDER}
 *   items={items}
 *   emptyLabel={APPLICATION_FORM.SEARCH_EMPTY}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EntityCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  items,
  emptyLabel,
  required = false,
  disabled = false,
  clearable = false,
  "aria-invalid": ariaInvalid,
}: EntityComboboxProps) {
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
        showClear={clearable}
        aria-invalid={ariaInvalid}
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
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

export { EntityCombobox }
