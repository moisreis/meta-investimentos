// Weight factors used for the first CNPJ check digit.
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

// Weight factors used for the second CNPJ check digit.
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

/**
 * @summary
 * Strips every non-digit character from a document value.
 *
 * @remarks
 * Accepts a masked or a raw value. The result length is
 * not checked here, so the caller decides what a valid
 * document looks like.
 *
 * @explanation
 * Use before counting or weighting the digits of a CPF
 * or a CNPJ. It returns only digits, without validation.
 *
 * @param value - Masked or raw document string.
 *
 * @returns The digits-only document string.
 *
 * @example
 * const DIGITS = StripDocumentDigits("529.982.247-25");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function StripDocumentDigits(value: string): string {
  return value.replace(/\D/g, "")
}

/**
 * @summary
 * Validates a **CPF** by its check digits.
 *
 * @remarks
 * Accepts masked (`000.000.000-00`) or digits-only
 * values. Rejects repeated digit sequences and wrong
 * check digits.
 *
 * @explanation
 * Use in sign-up and user form schemas before
 * submitting. It validates the digit count and both
 * check digits.
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
  const DIGITS = StripDocumentDigits(value)

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
 * Use in fund form schemas before submitting. It
 * validates the digit count and both check digits.
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
  const DIGITS = StripDocumentDigits(value)

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

export { IsValidCpf, IsValidCnpj, StripDocumentDigits }
