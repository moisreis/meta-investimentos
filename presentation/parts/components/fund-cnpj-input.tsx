"use client"

import type * as React from "react"
import { Input } from "@/presentation/ui/input"
import { useFundCnpjInput } from "../hooks/use-fund-cnpj-input.hook"

/**
 * @summary
 * Renders a **CNPJ** input with live masking.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as `00.000.000/0000-00`.
 *
 * @explanation
 * Use as the **CNPJ** field of any fund form.
 * Pass `value` and `onChange` for controlled mode.
 * Without them, manages its own state.
 *
 * @param props - Props forwarded to the input.
 * @param props.name - Field name, defaults to `cnpj`.
 * @param props.placeholder - Placeholder of the field.
 * @param props.value - Controlled masked value.
 * @param props.onChange - Called with masked value.
 *
 * @returns The masked **CNPJ** input.
 *
 * @example
 * <FundCnpjInput value={cnpj} onChange={setCnpj} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function FundCnpjInput({
  name = "cnpj",
  placeholder = "00.000.000/0000-00",
  value,
  onChange,
  disabled,
  ...props
}: Omit<
  React.ComponentProps<typeof Input>,
  "defaultValue" | "onChange"
> & {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}) {
  const { currentValue, handleChange } = useFundCnpjInput({
    value,
    onChange,
  })

  return (
    <Input
      {...props}
      name={name}
      inputMode="numeric"
      autoComplete="off"
      maxLength={18}
      placeholder={placeholder}
      value={currentValue}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}

export { FundCnpjInput }
