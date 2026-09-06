const NON_DIGIT_CHARS = /\D/g;

const CPF_DIGIT_LENGTH = 11;

/**
 * Formats raw CPF digits into the masked `000.000.000-00` layout.
 *
 * Non-digit characters are stripped and the input is truncated to the
 * eleven digits a CPF contains, so the returned string is always a valid
 * prefix of a formatted CPF while the user is typing.
 *
 * @param value - The raw CPF string, which may already contain
 *   formatting characters.
 * @returns The masked CPF string.
 *
 * @example
 * ```ts
 * maskCpf("52998224725")
 * // '529.982.247-25'
 * ```
 */
export function maskCpf(value: string): string {
  const digits = value.replace(NON_DIGIT_CHARS, "").slice(0, CPF_DIGIT_LENGTH);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return digits.replace(/^(\d{3})(\d+)$/, "$1.$2");
  }

  if (digits.length <= 9) {
    return digits.replace(/^(\d{3})(\d{3})(\d+)$/, "$1.$2.$3");
  }

  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d+)$/, "$1.$2.$3-$4");
}

/**
 * Strips the formatting characters from a CPF string, returning only its
 * digits.
 *
 * @param value - A masked or otherwise formatted CPF string.
 * @returns The CPF digits.
 *
 * @example
 * ```ts
 * unmaskCpf("529.982.247-25")
 * // '52998224725'
 * ```
 */
export function unmaskCpf(value: string): string {
  return value.replace(NON_DIGIT_CHARS, "");
}
