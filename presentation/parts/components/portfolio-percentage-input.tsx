"use client"

import type * as React from "react"
import { Input } from "@/presentation/ui/input"
import { usePortfolioPercentageInput } from "../hooks/use-portfolio-percentage-input.hook"

/**
 * @summary
 * Renders a **percentage** input with live masking.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as `0` to `999,99`.
 *
 * @explanation
 * Use as the percentage field of any portfolio form.
 * Pass `value` and `onChange` for controlled mode.
 * Without them, manages its own state.
 *
 * @param props - Props forwarded to the underlying input.
 * @param props.name - Field name, defaults to `percentage`.
 * @param props.placeholder - Placeholder text of the field.
 * @param props.value - Controlled masked value.
 * @param props.onChange - Called with masked value on change.
 *
 * @returns The masked **percentage** input.
 *
 * @example
 * <PortfolioPercentageInput value={rate} onChange={setRate} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function PortfolioPercentageInput({
  name = "percentage",
  placeholder = "0,00",
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
  const { currentValue, handleChange } =
    usePortfolioPercentageInput({ value, onChange })

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

export { PortfolioPercentageInput }
