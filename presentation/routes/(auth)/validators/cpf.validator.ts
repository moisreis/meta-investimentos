import { unmaskCPF } from "@/presentation/masks/cpf.mask"

/**
 * @summary
 * Validates a **CPF** by its check digits.
 *
 * @remarks
 * Accepts masked (`000.000.000-00`) or digits-only values.
 * Rejects repeated digit sequences and wrong check digits.
 *
 * @explanation
 * Use this validator in sign-up forms before submitting.
 * It validates the check digits and the digit count.
 *
 * @param value - Masked or raw **CPF** string.
 *
 * @returns Validity of the **CPF**.
 *
 * @example
 * const VALID = isValidCpf("529.982.247-25");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
function isValidCpf(value: string): boolean {
  const digits = unmaskCPF(value)

  if (!/^\d{11}$/.test(digits)) {
    return false
  }

  if (new Set(digits).size === 1) {
    return false
  }

  function checkDigit(position: number): number {
    const sum = digits
      .slice(0, position - 1)
      .split("")
      .reduce(
        (total, digit, index) => total + Number(digit) * (position - index),
        0
      )

    const remainder = sum % 11

    return remainder < 2 ? 0 : 11 - remainder
  }

  return (
    Number(digits[9]) === checkDigit(10) &&
    Number(digits[10]) === checkDigit(11)
  )
}

export { isValidCpf }