"use client"

import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"

import type { UserRole } from "@/lib/auth/user-role"

import {
  USER_FORM,
  USER_ROLE_LABELS,
} from "../settings/labels.settings"

// Roles offered by the picker, ordered from the least to the
// most privileged. Typed as `UserRole[]`, so a typo here is a
// compile error rather than an option the user can never reach.
const ROLE_VALUES: UserRole[] = ["USER", "MANAGER"]

/**
 * @summary
 * Builds the options offered by the role picker.
 *
 * @remarks
 * Reads the labels from `USER_ROLE_LABELS` instead of
 * repeating them, so a role can never be listed under a label
 * that disagrees with the datatable column or the rest of the
 * app. The map is a `Record<UserRole, string>`, so every role
 * already has one.
 *
 * @returns The role options, in picker order.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildRoleItems(): EntityComboboxItem[] {
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
}

/**
 * @summary
 * Renders the role picker of the add user form.
 *
 * @remarks
 * The options come from the role enum rather than from the
 * caller, because the roles are fixed at compile time instead
 * of loaded from the database like the portfolio and fund
 * pickers. That is the one thing this picker does that the
 * shared picker does not; the control itself is the shared
 * one, so a role reads and behaves like every other choice in
 * the app.
 *
 * The field is required, so the clear affordance is omitted
 * and the only way back to an empty value is to never pick a
 * role.
 *
 * @explanation
 * Use for the `Perfil` field of the add user form.
 *
 * @param props - Props of the role combobox.
 * @param props.id - Id of the input.
 * @param props.name - Form name submitted with the value.
 * @param props.value - The selected role.
 * @param props.onValueChange - Reports the next role.
 * @param props.placeholder - Empty input placeholder.
 * @param props.required - Marks the field required.
 * @param props.disabled - Blocks interaction.
 * @param props.ariaInvalid - Marks the field invalid.
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
}: UserRoleComboboxProps) {
  const ITEMS = BuildRoleItems()

  return (
    <EntityCombobox
      id={id}
      name={name}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      items={ITEMS}
      emptyLabel={USER_FORM.SEARCH_EMPTY}
      required={required}
      disabled={disabled}
      aria-invalid={ariaInvalid}
    />
  )
}

export { UserRoleCombobox }
