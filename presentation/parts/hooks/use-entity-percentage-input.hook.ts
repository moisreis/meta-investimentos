"use client"

import * as React from "react"
import {
  MaskPercentage,
  MaskSignedPercentage,
} from "@/presentation/masks/percentage.mask"

interface UseEntityPercentageInputParams {
  value?: string
  onChange?: (value: string) => void
  // Keeps the minus sign of a negative value. Set it for a
  // field whose value is a delta, such as a rate.
  signed?: boolean
}

/**
 * @summary
 * Manages the masked **percentage** input state.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as `0` to `999,99`, or as `-999,99` to
 * `999,99` when `signed` is set.
 *
 * @explanation
 * Use inside the percentage input to keep the
 * component presentational. Pass `value` and
 * `onChange` for controlled mode.
 *
 * @param params - Hook arguments.
 * @param params.value - Controlled masked value.
 * @param params.onChange - Called with masked value on change.
 * @param params.signed - Keeps the sign of a negative value.
 *
 * @returns Value and change handler.
 *
 * @example
 * const { currentValue, handleChange } =
 *   useEntityPercentageInput({ value, onChange })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useEntityPercentageInput({
  value,
  onChange,
  signed = false,
}: UseEntityPercentageInputParams) {
  const [INTERNAL_VALUE, setInternalValue] = React.useState("")
  const IS_CONTROLLED = value !== undefined

  const CURRENT_VALUE = IS_CONTROLLED ? value : INTERNAL_VALUE

  function HandleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const MASKED = signed
      ? MaskSignedPercentage(event.target.value)
      : MaskPercentage(event.target.value)

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

export { useEntityPercentageInput }
