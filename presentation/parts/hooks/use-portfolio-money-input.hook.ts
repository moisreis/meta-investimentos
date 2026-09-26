"use client"

import * as React from "react"
import { MaskCurrency } from "@/presentation/masks/currency.mask"

interface UsePortfolioMoneyInputParams {
  value?: string
  onChange?: (value: string) => void
}

/**
 * @summary
 * Manages the masked **money** input state.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as a signed value with comma decimals.
 *
 * @explanation
 * Use inside the money input to keep the component
 * presentational. Pass `value` and `onChange` for
 * controlled mode.
 *
 * @param params - Hook arguments.
 * @param params.value - Controlled masked value.
 * @param params.onChange - Called with masked value on change.
 *
 * @returns Value and change handler.
 *
 * @example
 * const { currentValue, handleChange } =
 *   usePortfolioMoneyInput({ value, onChange })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePortfolioMoneyInput({
  value,
  onChange,
}: UsePortfolioMoneyInputParams) {
  const [INTERNAL_VALUE, setInternalValue] = React.useState("")
  const IS_CONTROLLED = value !== undefined

  const CURRENT_VALUE = IS_CONTROLLED ? value : INTERNAL_VALUE

  function HandleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const MASKED = MaskCurrency(
      event.target.value,
      CURRENT_VALUE
    )

    if (!IS_CONTROLLED) {
      setInternalValue(MASKED)
    }

    onChange?.(MASKED)
  }

  return {
    currentValue: CURRENT_VALUE,
    handleChange: HandleChange,
  }
}

export { usePortfolioMoneyInput }
