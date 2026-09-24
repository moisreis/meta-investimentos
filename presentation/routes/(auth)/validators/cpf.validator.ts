import { UnmaskCPF } from "@/presentation/masks/cpf.mask"

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
 * const VALID = IsValidCpf("529.982.247-25");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
function IsValidCpf(value: string): boolean {
  const DIGITS = UnmaskCPF(value)

  if (!/^\d{11}$/.test(DIGITS)) {
    return false
  }

  if (new Set(DIGITS).size === 1) {
    return false
  }

  function CheckDigit(position: number): number {
    const SUM = DIGITS.slice(0, position - 1)
      .split("")
      .reduce(
        (total, digit, index) =>
          total + Number(digit) * (position - index),
        0
      )

    const REMAINDER = SUM % 11

    return REMAINDER < 2 ? 0 : 11 - REMAINDER
  }

  return (
    Number(DIGITS[9]) === CheckDigit(10) &&
    Number(DIGITS[10]) === CheckDigit(11)
  )
}

export { IsValidCpf }
