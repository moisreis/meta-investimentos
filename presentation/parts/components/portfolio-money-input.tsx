"use client"

import type * as React from "react"
import { Input } from "@/presentation/ui/input"
import { usePortfolioMoneyInput } from "../hooks/use-portfolio-money-input.hook"

/**
 * @summary
 * Renders a **money** input with live masking.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as a signed value with comma decimals.
 *
 * @explanation
 * Use as the money field of any portfolio form.
 * Pass `value` and `onChange` for controlled mode.
 * Without them, manages its own state.
 *
 * @param props - Props forwarded to the underlying input.
 * @param props.name - Field name, defaults to `money`.
 * @param props.placeholder - Placeholder text of the field.
 * @param props.value - Controlled masked value.
 * @param props.onChange - Called with masked value on change.
 *
 * @returns The masked **money** input.
 *
 * @example
 * <PortfolioMoneyInput value={amount} onChange={setAmount} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioMoneyInput({
  name = "money",
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
  const { currentValue, handleChange } = usePortfolioMoneyInput({
    value,
    onChange,
  })

  return (
    <Input
      {...props}
      name={name}
      inputMode="decimal"
      autoComplete="off"
      maxLength={16}
      placeholder={placeholder}
      value={currentValue}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}

export { PortfolioMoneyInput }
