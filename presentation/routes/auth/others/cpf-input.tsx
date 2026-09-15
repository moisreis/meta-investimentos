"use client"

import * as React from "react"
import { Input } from "@/presentation/ui/input"
import { maskCPF } from "@/presentation/masks/cpf.mask"

/**
 * @summary
 * Renders a **CPF** input with live masking.
 *
 * @remarks
 * The input holds its own masked value state.
 * Formatting is applied on every text change.
 *
 * @explanation
 * Use as the **CPF** field of any registration form.
 * It masks the typed digits as `000.000.000-00`.
 *
 * @param props - Props forwarded to the underlying input.
 * @param props.name - Field name, defaults to `cpf`.
 * @param props.placeholder - Placeholder text of the field.
 * @returns The masked **CPF** input.
 *
 * @example
 * <CpfInput />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
function CpfInput({
  name = "cpf",
  placeholder = "000.000.000-00",
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "defaultValue">) {
  // Stores the masked text shown in the input.
  const [value, setValue] = React.useState("")

  // Applies the **CPF** mask to the typed value.
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(maskCPF(event.target.value))
  }

  return (
    <Input
      {...props}
      name={name}
      inputMode="numeric"
      autoComplete="off"
      maxLength={14}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  )
}

export { CpfInput }