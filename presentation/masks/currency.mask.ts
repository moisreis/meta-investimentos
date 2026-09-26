// Maximum lengths for the currency integer and decimal
// parts.
const CURRENCY_INTEGER_LENGTH = 12
const CURRENCY_DECIMAL_LENGTH = 2

// Detects a raw value whose dots are **BRL** thousand
// groups (every group has exactly three digits).
const GROUPED_PATTERN = /^\d{1,3}(\.\d{3})+$/

/**
 * @summary
 * Masks a **currency** input by formatting its numeric
 * value as **BRL**.
 *
 * @remarks
 * Renders a signed value with dot thousand separators and
 * comma decimals. While only digits are typed, two decimal
 * places show live (`15000` becomes `15.000,00`). Typing a
 * comma starts the decimals, which stay exactly as typed.
 * During editing every dot is a thousand group; a dot
 * decimal is only honored for seed values. Appending a
 * digit after the automatic `,00` continues the integer
 * part, and backspacing at the automatic `,00` removes
 * the last integer digit directly.
 *
 * @explanation
 * Use on text input changes to keep a currency field
 * formatted in real time. Pass the previous masked
 * value as `previous` so end appends are interpreted
 * correctly. It returns the formatted string without
 * validation.
 *
 * @param value - Raw currency input string.
 * @param previous - Previous masked value, if any.
 * @returns The masked currency string.
 *
 * @example
 * const MASKED = MaskCurrency("1500000", "15.000,00");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function MaskCurrency(value: string, previous = ""): string {
  // Keeps only digits, separators and the sign.
  const CLEANED = value.replace(/[^\d,.-]/g, "")
  const NEGATIVE = CLEANED.startsWith("-")
  const BODY = CLEANED.replace(/-/g, "")

  let INTEGER = ""
  let DECIMALS = ""

  if (BODY.includes(",")) {
    // The last comma is the decimal separator; every
    // dot before it is a thousand group. An extra comma
    // on the integer side is the automatic separator of
    // the previous display and must be unwrapped.
    const LAST_COMMA = BODY.lastIndexOf(",")
    const INTEGER_SIDE = BODY.slice(0, LAST_COMMA)
    const FIRST_COMMA = INTEGER_SIDE.indexOf(",")
    const INTEGER_END =
      FIRST_COMMA >= 0 ? FIRST_COMMA : INTEGER_SIDE.length
    INTEGER = INTEGER_SIDE.slice(0, INTEGER_END).replace(
      /[.,]/g,
      ""
    )
    DECIMALS = BODY.slice(LAST_COMMA + 1).replace(/[.,]/g, "")
  } else if (BODY.includes(".")) {
    // While the user is editing, every dot is a
    // thousand group. Only seed values (no previous
    // value) may use a dot as the decimal separator.
    if (previous !== "" || GROUPED_PATTERN.test(BODY)) {
      INTEGER = BODY.replace(/\./g, "")
    } else {
      const LAST_DOT = BODY.lastIndexOf(".")
      INTEGER = BODY.slice(0, LAST_DOT)
      DECIMALS = BODY.slice(LAST_DOT + 1)
    }
  } else {
    INTEGER = BODY
  }

  // A single digit appended at the end of an automatic
  // `,00` keeps building the integer part. A trailing
  // comma instead starts the decimals.
  const APPENDED_CHAR =
    previous &&
    value.length === previous.length + 1 &&
    value.startsWith(previous)
      ? value.slice(-1)
      : ""

  if (
    APPENDED_CHAR &&
    /\d/.test(APPENDED_CHAR) &&
    previous.endsWith(",00")
  ) {
    const PREVIOUS_INTEGER = previous
      .slice(0, previous.lastIndexOf(","))
      .replace(/[.,-]/g, "")
    INTEGER = PREVIOUS_INTEGER + APPENDED_CHAR
    DECIMALS = "00"
  }

  // A single backspace at the end of an automatic `,00`
  // removes the last integer digit, skipping the cosmetic
  // decimals so every press actually shrinks the number.
  const DELETED_LAST_CHAR =
    previous &&
    value.length === previous.length - 1 &&
    previous.startsWith(value)
      ? previous.slice(-1)
      : ""

  if (DELETED_LAST_CHAR && previous.endsWith(",00")) {
    const PREVIOUS_INTEGER = previous
      .slice(0, previous.lastIndexOf(","))
      .replace(/[.,-]/g, "")
    INTEGER = PREVIOUS_INTEGER.slice(0, -1)
    DECIMALS = ""
  }

  if (INTEGER === "" && DECIMALS === "") {
    return NEGATIVE ? "-" : ""
  }

  INTEGER = INTEGER.slice(0, CURRENCY_INTEGER_LENGTH)
  DECIMALS = DECIMALS.slice(0, CURRENCY_DECIMAL_LENGTH)

  // Shows a zero integer when only cents were typed.
  if (INTEGER === "") {
    INTEGER = "0"
  }

  // Keeps the trailing comma visible while cents are
  // being typed.
  const SHOW_TRAILING_COMMA =
    DECIMALS === "" && BODY.endsWith(",")

  const GROUPED = INTEGER.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  const SIGN = NEGATIVE ? "-" : ""

  return SHOW_TRAILING_COMMA
    ? `${SIGN}${GROUPED},`
    : `${SIGN}${GROUPED},${DECIMALS || "00"}`
}

/**
 * @summary
 * Removes the formatting from a **currency** value.
 *
 * @remarks
 * Strips the **BRL** dot thousand separators, converts the
 * decimal comma to a dot and parses the value into a plain
 * number string, keeping the sign. Returns an empty string
 * when unparsable.
 *
 * @explanation
 * Use before persisting or validating a currency value. It
 * returns the canonical value without validation.
 *
 * @param value - Masked currency string.
 * @returns The plain number string.
 *
 * @example
 * const NUMBER = UnmaskCurrency("-1.234,56");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UnmaskCurrency(value: string): string {
  const NORMALIZED = value.replace(/\./g, "").replace(",", ".")
  const PARSED = Number.parseFloat(NORMALIZED)

  return Number.isFinite(PARSED) ? String(PARSED) : ""
}

export { MaskCurrency, UnmaskCurrency }
