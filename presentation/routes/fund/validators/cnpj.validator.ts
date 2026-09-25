import { UnmaskCNPJ } from "@/presentation/masks/cnpj.mask"

// Weight factors used for the first check digit.
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

// Weight factors used for the second check digit.
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

/**
 * @summary
 * Validates a **CNPJ** by its check digits.
 *
 * @remarks
 * Accepts masked (`00.000.000/0000-00`) or digits-only
 * values. Rejects repeated digit sequences and wrong
 * check digits.
 *
 * @explanation
 * Use this validator in fund forms before submitting.
 * It validates the check digits and the digit count.
 *
 * @param value - Masked or raw **CNPJ** string.
 *
 * @returns Validity of the **CNPJ**.
 *
 * @example
 * const VALID = IsValidCnpj("11.222.333/0001-81");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function IsValidCnpj(value: string): boolean {
  const DIGITS = UnmaskCNPJ(value)

  if (!/^\d{14}$/.test(DIGITS)) {
    return false
  }

  if (new Set(DIGITS).size === 1) {
    return false
  }

  function CheckDigit(weights: number[]): number {
    const SUM = weights.reduce(
      (total, weight, index) =>
        total + Number(DIGITS[index]) * weight,
      0
    )

    const REMAINDER = SUM % 11

    return REMAINDER < 2 ? 0 : 11 - REMAINDER
  }

  return (
    Number(DIGITS[12]) === CheckDigit(FIRST_WEIGHTS) &&
    Number(DIGITS[13]) === CheckDigit(SECOND_WEIGHTS)
  )
}

export { IsValidCnpj }
