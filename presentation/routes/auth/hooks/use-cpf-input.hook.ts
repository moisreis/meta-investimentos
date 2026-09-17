"use client"

import * as React from "react"
import { maskCPF } from "@/presentation/masks/cpf.mask"

interface UseCpfInputParams {
  value?: string
  onChange?: (value: string) => void
}

/**
 * @summary
 * Manages the masked **CPF** input state.
 *
 * @remarks
 * Supports both controlled and uncontrolled modes.
 * Formats input as `000.000.000-00`.
 *
 * @explanation
 * Use inside the **CPF** input to keep the component presentational.
 * Pass `value` and `onChange` for controlled mode.
 *
 * @param params - Hook arguments.
 * @param params.value - Controlled masked value.
 * @param params.onChange - Called with masked value on change.
 * @returns The current value and change handler.
 *
 * @example
 * const { currentValue, handleChange } = useCpfInput({ value, onChange })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
function useCpfInput({ value, onChange }: UseCpfInputParams) {
  const [internalValue, setInternalValue] = React.useState("")
  const isControlled = value !== undefined

  const currentValue = isControlled ? value : internalValue

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskCPF(event.target.value)

    if (!isControlled) {
      setInternalValue(masked)
    }

    onChange?.(masked)
  }

  return { currentValue, handleChange }
}

export { useCpfInput }
