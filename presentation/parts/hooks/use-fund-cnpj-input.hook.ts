"use client"

import * as React from "react"
import { MaskCNPJ } from "@/presentation/masks/cnpj.mask"

interface UseFundCnpjInputParams {
  value?: string
  onChange?: (value: string) => void
}

/**
 * @summary
 * Manages the masked **CNPJ** input state.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as `00.000.000/0000-00`.
 *
 * @explanation
 * Use inside the **CNPJ** input to keep the
 * component presentational. Pass `value` and
 * `onChange` for controlled mode.
 *
 * @param params - Hook arguments.
 * @param params.value - Controlled masked value.
 * @param params.onChange - Called with masked value.
 *
 * @returns Value and change handler.
 *
 * @example
 * const { currentValue, handleChange } =
 *   useFundCnpjInput({ value, onChange })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useFundCnpjInput({
  value,
  onChange,
}: UseFundCnpjInputParams) {
  const [INTERNAL_VALUE, setInternalValue] = React.useState("")
  const IS_CONTROLLED = value !== undefined

  const CURRENT_VALUE = IS_CONTROLLED ? value : INTERNAL_VALUE

  function HandleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const MASKED = MaskCNPJ(event.target.value)

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

export { useFundCnpjInput }
