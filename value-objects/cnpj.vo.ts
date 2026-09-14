import { ValidationError } from "@/errors"

// Maximum length for CNPJ string.
const CNPJ_LENGTH = 14

// Regular expression to check identical repeated digits.
const ALL_SAME_DIGIT = /^(\d)\1{13}$/

// Weight factors used for the first check digit.
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

// Weight factors used for the second check digit.
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

interface CNPJProps {
  value: string
}

/**
 * @summary
 * Encapsulates and validates a Brazilian **CNPJ** identifier.
 *
 * @remarks
 * Implements value object semantics for **CNPJ** records.
 * Ensures the input passes structural, length, repeated
 * digit, and official checksum validation rules.
 *
 * @explanation
 * Use this domain value object to guarantee that any
 * **CNPJ** instance in the system represents a valid
 * corporate registration number. It strip non-numeric
 * characters upon creation and enforces immutability.
 *
 * @param props - Object containing the sanitized **CNPJ**
 *                digits string.
 *
 * @example
 * const CNPJ = CNPJ.create("00.000.000/0001-91");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class CNPJ {
  private readonly props: CNPJProps

  // Gets the sanitized numerical 14-digit CNPJ string.
  get value(): string {
    return this.props.value
  }

  // Initializes internal properties for the CNPJ instance.
  private constructor(props: CNPJProps) {
    this.props = props
  }

  /**
   * @summary
   * Creates and validates a new **CNPJ** value object.
   *
   * @remarks
   * Removes all non-digit characters before performing
   * length checks and verifying checksum digits.
   *
   * @explanation
   * Use this factory method to construct a valid **CNPJ**
   * instance. Throws a **ValidationError** if the raw
   * input string fails validation constraints.
   *
   * @param value - Raw **CNPJ** string to parse and validate.
   *
   * @example
   * const INSTANCE = CNPJ.create("00000000000191");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(value: string): CNPJ {
    if (value === undefined || value === null) {
      throw new ValidationError("CNPJ must be defined.")
    }

    if (value.trim() === "") {
      throw new ValidationError("`CNPJ` must not be blank.")
    }

    // Extracts digits by removing non-numeric characters.
    const DIGITS = value.replace(/\D/g, "")

    if (DIGITS.length !== CNPJ_LENGTH) {
      throw new ValidationError("`CNPJ` must contain exactly 14 digits.")
    }

    if (ALL_SAME_DIGIT.test(DIGITS)) {
      throw new ValidationError(
        "`CNPJ` must not be a sequence of identical digits."
      )
    }

    if (!CNPJ.isValid(DIGITS)) {
      throw new ValidationError("`CNPJ` must pass the check-digit algorithm.")
    }

    return new CNPJ({ value: DIGITS })
  }

  /**
   * @summary
   * Compares two **CNPJ** instances for equality.
   *
   * @remarks
   * Evaluates equality based on the underlying sanitized
   * numerical value.
   *
   * @explanation
   * Use this method to check whether two **CNPJ** value
   * objects refer to the same corporate registration.
   *
   * @param a - First **CNPJ** instance to compare.
   * @param b - Second **CNPJ** instance to compare.
   *
* @returns True if both instances hold equal values.
    *
    * @example
    * const IS_SAME = CNPJ.equals(cnpjA, cnpjB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static equals(a: CNPJ, b: CNPJ): boolean {
    return a.value === b.value
  }

  /**
   * @summary
   * Validates check digits for a 14-digit **CNPJ** string.
   *
   * @remarks
   * Computes expected verification digits using weight
   * arrays and compares them against provided digits.
   *
   * @explanation
   * Internal helper method that executes the standard
   * Brazilian **CNPJ** verification algorithm.
   *
* @param digits - Sanitized 14-digit **CNPJ** string.
    *
    * @returns True if the check digits match.
    *
    * @example
    * const VALID = CNPJ.isValid("00000000000191");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private static isValid(digits: string): boolean {
    // Extracts the first twelve digits for initial check computation.
    const FIRST_TWELVE = digits.substring(0, 12)

    // Calculates the first verification digit using first weights.
    const FIRST_CHECK = CNPJ.computeCheckDigit(FIRST_TWELVE, FIRST_WEIGHTS)

    // Combines the first twelve digits with the first check digit.
    const FIRST_THIRTEEN = FIRST_TWELVE + FIRST_CHECK

    // Calculates the second verification digit using second weights.
    const SECOND_CHECK = CNPJ.computeCheckDigit(FIRST_THIRTEEN, SECOND_WEIGHTS)

    // Combines both calculated check digits for final verification.
    const EXPECTED = FIRST_CHECK + SECOND_CHECK

    return digits.substring(12) === EXPECTED
  }

  /**
   * @summary
   * Calculates a single **CNPJ** verification digit.
   *
   * @remarks
   * Multiplies each digit by its corresponding weight,
   * sums the results, and applies modulus 11 logic.
   *
   * @explanation
   * Helper algorithm that returns the expected check
   * digit character based on partial **CNPJ** input and
   * weight sequences.
   *
* @param partial - Partial digit string to compute against.
    * @param weights - Array of numerical weights.
    *
    * @returns Computed check digit character.
    *
    * @example
    * const DIGIT = CNPJ.computeCheckDigit("000000000001", weights);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private static computeCheckDigit(partial: string, weights: number[]): string {
    // Accumulates the weighted sum of partial digits.
    let SUM = 0

    // Iterates through partial digits to compute weighted values.
    for (let INDEX = 0; INDEX < partial.length; INDEX++) {
      SUM += Number(partial[INDEX]) * weights[INDEX]
    }

    // Calculates the modulus 11 remainder of the total sum.
    const REMAINDER = SUM % 11

    // Determines the check digit character based on remainder.
    const DIGIT = REMAINDER < 2 ? "0" : String(11 - REMAINDER)

    return DIGIT
  }
}
