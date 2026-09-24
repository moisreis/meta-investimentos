// Maximum length for CPF digits.
const CPF_DIGITS_LENGTH = 11

/**
 * @summary
 * Masks a **CPF** input by formatting its digits.
 *
 * @remarks
 * Strips non-digit characters and caps the length.
 * Applies the `000.000.000-00` grouping progressively.
 *
 * @explanation
 * Use on text input changes to keep the field formatted.
 * It returns the formatted string without validation.
 *
 * @param value - Raw **CPF** input string.
 * @returns The masked **CPF** string.
 *
 * @example
 * const MASKED = maskCPF("52998224725");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function maskCPF(value: string): string {
  // Keeps only the first 11 digit characters.
  const digits = value.replace(/\D/g, "").slice(0, CPF_DIGITS_LENGTH)

  // Groups the digits as `000.000.000-00`.
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
}

/**
 * @summary
 * Removes the formatting from a **CPF** value.
 *
 * @remarks
 * Keeps only the numeric digit characters.
 *
 * @explanation
 * Use before persisting or validating a **CPF**.
 * It returns only digits without validation.
 *
 * @param value - Masked or raw **CPF** string.
 * @returns The digits-only **CPF** string.
 *
 * @example
 * const DIGITS = unmaskCPF("529.982.247-25");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function unmaskCPF(value: string): string {
  // Keeps only the digit characters.
  return value.replace(/\D/g, "")
}

export { maskCPF, unmaskCPF }