"use client"

import type * as React from "react"
import { Input } from "@/presentation/ui/input"
import { useCpfInput } from "@/presentation/routes/(auth)/hooks/use-cpf-input.hook"

/**
 * @summary
 * Renders a **CPF** input with live masking.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as `000.000.000-00`.
 *
 * @explanation
 * Use as the **CPF** field of any registration form.
 * Pass `value` and `onChange` for controlled mode.
 * Without them, manages its own state.
 *
 * @param props - Props forwarded to the underlying input.
 * @param props.name - Field name, defaults to `cpf`.
 * @param props.placeholder - Placeholder text of the field.
 * @param props.value - Controlled masked value.
 * @param props.onChange - Called with masked value on change.
 * @returns The masked **CPF** input.
 *
 * @example
 * <CpfInput value={cpf} onChange={setCpf} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function CpfInput({
  name = "cpf",
  placeholder = "000.000.000-00",
  value,
  onChange,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "defaultValue" | "onChange"> & {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}) {
  const { currentValue, handleChange } = useCpfInput({ value, onChange })

  return (
    <Input
      {...props}
      name={name}
      inputMode="numeric"
      autoComplete="off"
      maxLength={14}
      placeholder={placeholder}
      value={currentValue}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}

export { CpfInput }