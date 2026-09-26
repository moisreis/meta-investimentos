"use client"

import type * as React from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/presentation/ui/input-group"
import { usePortfolioMoneyInput } from "../hooks/use-portfolio-money-input.hook"

// Shows the currency on the input group addon.
const BRL_CURRENCY_SYMBOL = "R$"

/**
 * @summary
 * Renders a **money** input with live masking.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input in real time as a signed **BRL**
 * value with dot thousand separators and comma
 * decimals. Prefixes the input with the **BRL**
 * symbol as an addon.
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
  React.ComponentProps<typeof InputGroupInput>,
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
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText aria-hidden="true">
          {BRL_CURRENCY_SYMBOL}
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        {...props}
        name={name}
        inputMode="decimal"
        autoComplete="off"
        maxLength={24}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
      />
    </InputGroup>
  )
}

export { PortfolioMoneyInput }
