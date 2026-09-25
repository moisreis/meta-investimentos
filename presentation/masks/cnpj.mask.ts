// Maximum length for CNPJ digits.
const CNPJ_DIGITS_LENGTH = 14

/**
 * @summary
 * Masks a **CNPJ** input by formatting its digits.
 *
 * @remarks
 * Strips non-digit characters and caps the length.
 * Applies the `00.000.000/0000-00` grouping
 * progressively.
 *
 * @explanation
 * Use on text input changes to keep the field
 * formatted. It returns the formatted string without
 * validation.
 *
 * @param value - Raw **CNPJ** input string.
 * @returns The masked **CNPJ** string.
 *
 * @example
 * const MASKED = MaskCNPJ("11222333000181");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function MaskCNPJ(value: string): string {
  // Keeps only the first 14 digit characters.
  const DIGITS = value
    .replace(/\D/g, "")
    .slice(0, CNPJ_DIGITS_LENGTH)

  // Groups the digits as `00.000.000/0000-00`.
  return DIGITS.replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(
      /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/,
      "$1.$2.$3/$4-$5"
    )
}

/**
 * @summary
 * Removes the formatting from a **CNPJ** value.
 *
 * @remarks
 * Keeps only the numeric digit characters.
 *
 * @explanation
 * Use before persisting or validating a **CNPJ**.
 * It returns only digits without validation.
 *
 * @param value - Masked or raw **CNPJ** string.
 * @returns The digits-only **CNPJ** string.
 *
 * @example
 * const DIGITS = UnmaskCNPJ("11.222.333/0001-81");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UnmaskCNPJ(value: string): string {
  // Keeps only the digit characters.
  return value.replace(/\D/g, "")
}

export { MaskCNPJ, UnmaskCNPJ }
