"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/presentation/ui/combobox"
import { Item, ItemContent, ItemTitle } from "@/presentation/ui/item"

import { USER_ROLE_LABELS } from "../settings/labels.settings"

import type { UserRole } from "@/lib/auth/user-role"

// Option rendered by the user role combobox.
export interface UserRoleComboboxItem {
  // Id submitted to the form, which is the role value.
  id: string
  // Primary text rendered in the list and the input.
  name: string
}

// Roles offered by the picker, ordered from the least to the
// most privileged. Typed as `UserRole[]`, so a typo here is a
// compile error rather than an option the user can never
// reach.
const ROLE_VALUES: UserRole[] = ["USER", "MANAGER"]

/**
 * @summary
 * Builds the options offered by the role picker.
 *
 * @remarks
 * Reads the labels from `USER_ROLE_LABELS` instead of
 * repeating them, so a role can never be listed under a
 * label that disagrees with the datatable column or the rest
 * of the app. The map is a `Record<UserRole, string>`, so
 * every role already has one.
 *
 * @returns The role options, in picker order.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildRoleItems(): UserRoleComboboxItem[] {
  return ROLE_VALUES.map((role) => ({
    id: role,
    name: USER_ROLE_LABELS[role],
  }))
}

interface UserRoleComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  required?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean | "true" | "false"
  // Copy shown when no option matches the query.
  emptyLabel?: string
}

/**
 * @summary
 * Renders the role picker of the add user form.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI. The
 * selected role is synced to the form as a string, which is
 * the same shape the **Zod** schema validates, so picking an
 * option replaces the previous choice and clearing the field
 * falls back to the empty string the schema rejects.
 *
 * The options come from the role enum rather than from the
 * caller, because the roles are fixed at compile time instead
 * of loaded from the database like the portfolio and fund
 * pickers. The field is required, so the clear button is
 * omitted and the only way back to an empty value is to never
 * pick a role.
 *
 * @explanation
 * Use for the `Perfil` field of the add user form.
 *
 * @param props - Props of the role combobox.
 * @param props.value - The selected role.
 * @param props.onValueChange - Reports the next role.
 * @param props.placeholder - Empty input placeholder.
 * @param props.emptyLabel - Copy shown when nothing matches.
 *
 * @returns The role combobox.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function UserRoleCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
  emptyLabel = "Nenhum perfil encontrado",
}: UserRoleComboboxProps) {
  const ITEMS = BuildRoleItems()
  const SELECTED =
    ITEMS.find((item) => item.id === value) ?? null

  return (
    <Combobox
      items={ITEMS}
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
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { UserRoleCombobox }
