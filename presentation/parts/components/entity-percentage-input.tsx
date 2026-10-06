"use client"

import type * as React from "react"
import { Input } from "@/presentation/ui/input"
import { useEntityPercentageInput } from "../hooks/use-entity-percentage-input.hook"

/**
 * @summary
 * Renders a **percentage** input with live masking.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as `0` to `999,99`, or as `-999,99` to
 * `999,99` when `signed` is set.
 *
 * @explanation
 * Use as the percentage field of any portfolio form.
 * Pass `value` and `onChange` for controlled mode.
 * Without them, manages its own state.
 * Set `signed` for a field whose value is a delta, such as a
 * rate: the plain mask drops the minus sign, which would make
 * a loss impossible to type.
 *
 * @param props - Props forwarded to the underlying input.
 * @param props.name - Field name, defaults to `percentage`.
 * @param props.placeholder - Placeholder text of the field.
 * @param props.value - Controlled masked value.
 * @param props.onChange - Called with masked value on change.
 * @param props.signed - Keeps the sign of a negative value.
 *
 * @returns The masked **percentage** input.
 *
 * @example
 * <EntityPercentageInput value={rate} onChange={setRate} signed />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityPercentageInput({
  name = "percentage",
  placeholder = "0,00",
  value,
  onChange,
  disabled,
  signed = false,
  ...props
}: Omit<
  React.ComponentProps<typeof Input>,
  "defaultValue" | "onChange"
> & {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  signed?: boolean
}) {
  const { currentValue, handleChange } =
    useEntityPercentageInput({ value, onChange, signed })

  return (
    <Input
      {...props}
      name={name}
      inputMode="decimal"
      autoComplete="off"
      maxLength={6}
      placeholder={placeholder}
      value={currentValue}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}

export { EntityPercentageInput }
