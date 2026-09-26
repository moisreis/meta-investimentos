import { ValidationError } from "@/errors"

// Maximum length for CPF string.
const CPF_LENGTH = 11

// Regular expression to check identical repeated digits.
const ALL_SAME_DIGIT = /^(\d)\1{10}$/

interface CPFProps {
  value: string
}

/**
 * @summary
 * Encapsulates and validates a Brazilian **CPF** identifier.
 *
 * @remarks
 * Implements value object semantics for **CPF** records.
 * Ensures the input passes structural, length, repeated
 * digit, and official checksum validation rules.
 *
 * @explanation
 * Use this domain value object to guarantee that any
 * **CPF** instance in the system represents a valid
 * individual registration number. It strips non-numeric
 * characters upon creation and enforces immutability.
 * Apply it in domain layers where personal identity
 * validation is required.
 *
 * @param props - Object containing the sanitized **CPF**
 *                digits string.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export class CPF {
  private readonly props: CPFProps

  // Gets the sanitized numerical 11-digit CPF string.
  get value(): string {
    return this.props.value
  }

  // Initializes internal properties for the CPF instance.
  private constructor(props: CPFProps) {
    this.props = props
  }

  /**
   * @summary
   * Creates and validates a new **CPF** value object.
   *
   * @remarks
   * Removes all non-digit characters before performing
   * length checks and verifying checksum digits.
   *
   * @explanation
   * Use this factory method to construct a valid **CPF**
   * instance. Throws a **ValidationError** if the raw
   * input string fails validation constraints. Call it
   * when receiving **CPF** data from external sources.
   *
   * @param value - Raw **CPF** string to parse and validate.
   * @returns Validated CPF instance.
   *
   * @example
   * const INSTANCE = CPF.create("52998224725");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  public static create(value: string): CPF {
    if (value === undefined || value === null) {
      throw new ValidationError("`CPF` must be defined.")
    }

    if (value.trim() === "") {
      throw new ValidationError("`CPF` must not be blank.")
    }

    // Extracts digits by removing non-numeric characters.
    const DIGITS = value.replace(/\D/g, "")

    if (DIGITS.length !== CPF_LENGTH) {
      throw new ValidationError(
        "`CPF` must contain exactly 11 digits."
      )
    }

    if (ALL_SAME_DIGIT.test(DIGITS)) {
      throw new ValidationError(
        "`CPF` must not be a sequence of identical digits."
      )
    }

    if (!CPF.isValid(DIGITS)) {
      throw new ValidationError(
        "`CPF` must pass the check-digit algorithm."
      )
    }

    return new CPF({ value: DIGITS })
  }

  /**
   * @summary
   * Compares two **CPF** instances for equality.
   *
   * @remarks
   * Evaluates equality based on the underlying sanitized
   * numerical value.
   *
   * @explanation
   * Use this method to check whether two **CPF** value
   * objects refer to the same individual registration.
   * Call it when comparing identities in domain logic.
   *
   * @param a - First **CPF** instance to compare.
   * @param b - Second **CPF** instance to compare.
   * @returns True if both values match.
   *
   * @example
   * const IS_SAME = CPF.equals(cpfA, cpfB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  public static equals(a: CPF, b: CPF): boolean {
    return a.value === b.value
  }

  /**
   * @summary
   * Validates check digits for an 11-digit **CPF** string.
   *
   * @remarks
   * Computes expected verification digits using weight
   * factors and compares them against provided digits.
   *
   * @explanation
   * Internal helper method that executes the standard
   * Brazilian **CPF** verification algorithm. It uses
   * decreasing weight factors to compute both check digits
   * and validates them against the input string.
   *
   * @param digits - Sanitized 11-digit **CPF** string.
   * @returns True if check digits match.
   *
   * @example
   * const VALID = CPF.isValid("52998224725");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  private static isValid(digits: string): boolean {
    // Extracts the first nine digits for initial check computation.
    const FIRST_NINE = digits.substring(0, 9)

    // Calculates the first verification digit using initial weight 10.
    const FIRST_CHECK = CPF.computeCheckDigit(FIRST_NINE, 10)

    // Combines the first nine digits with the first check digit.
    const FIRST_TEN = FIRST_NINE + FIRST_CHECK

    // Calculates the second verification digit using initial weight 11.
    const SECOND_CHECK = CPF.computeCheckDigit(FIRST_TEN, 11)

    // Combines both calculated check digits for final verification.
    const EXPECTED = FIRST_CHECK + SECOND_CHECK

    return digits.substring(9) === EXPECTED
  }

  /**
   * @summary
   * Calculates a single **CPF** verification digit.
   *
   * @remarks
   * Multiplies each digit by a decreasing weight factor,
   * sums the results, and applies modulus 11 logic.
   *
   * @explanation
   * Helper algorithm that returns the expected check
   * digit character based on partial **CPF** input and
   * initial weight. Used internally by the validator.
   *
   * @param partial - Partial digit string to compute against.
   * @param weight - Starting numerical weight factor.
   * @returns Computed check digit character.
   *
   * @example
   * const DIGIT = CPF.computeCheckDigit("000000000", 10);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  private static computeCheckDigit(
    partial: string,
    weight: number
  ): string {
    // Accumulates the weighted sum of partial digits.
    let SUM = 0

    // Iterates through partial digits to compute weighted values.
    for (let INDEX = 0; INDEX < partial.length; INDEX++) {
      SUM += Number(partial[INDEX]) * (weight - INDEX)
    }

    // Calculates the modulus 11 remainder of the total sum.
    const REMAINDER = SUM % 11

    // Determines the check digit character based on remainder.
    const DIGIT = REMAINDER < 2 ? "0" : String(11 - REMAINDER)

    return DIGIT
  }
}
