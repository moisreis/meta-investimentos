import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties of a {@link CPF}.
 */
interface CPFProps {
  value: string;
}

const ALL_SAME_DIGIT = /^(\d)\1{10}$/;

/**
 * Value object representing a Brazilian CPF (Cadastro de Pessoas
 * Físicas) — the individual taxpayer identification number.
 *
 * A `CPF`:
 * - must be defined.
 * - must not be blank.
 * - must contain exactly 11 digits after stripping non-digit characters.
 * - must not be a sequence of identical digits.
 * - must pass the official check-digit algorithm.
 *
 * The value is stored with only digits, stripped of any formatting
 * characters (dots, dashes, spaces).
 *
 * `CPF` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const CPF = CPF.create('529.982.247-25')
 *
 * CPF.value
 * // '52998224725'
 * ```
 *
 * @example
 * ```ts
 * const A = CPF.create('52998224725')
 * const B = CPF.create('529.982.247-25')
 *
 * CPF.equals(A, B)
 * // true
 * ```
 */
class CPF {
  private readonly props: CPFProps;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the CPF value with only digits.
   */
  get value(): string {
    return this.props.value;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `CPF`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link CPF.create} and therefore
   * satisfy the CPF's invariants.
   */
  private constructor(props: CPFProps) {
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `CPF` from the provided value.
   *
   * The value may contain formatting characters (dots, dashes,
   * spaces), which are stripped before validation. The resulting
   * value contains only digits.
   *
   * @param value - The CPF string to validate and create.
   * @returns A valid `CPF` instance.
   *
   * @throws {ValidationError} If `value` is `undefined` or `null`.
   * @throws {ValidationError} If `value` is blank.
   * @throws {ValidationError} If `value` does not contain exactly 11 digits.
   * @throws {ValidationError} If `value` is a sequence of identical digits.
   * @throws {ValidationError} If `value` does not pass the check-digit algorithm.
   *
   * @example
   * ```ts
   * const CPF = CPF.create('529.982.247-25')
   *
   * CPF.value
   * // '52998224725'
   * ```
   */
  public static create(value: string): CPF {
    if (value === undefined || value === null) {
      throw new ValidationError("`CPF` must be defined.");
    }

    if (value.trim() === "") {
      throw new ValidationError("`CPF` must not be blank.");
    }

    const DIGITS = value.replace(/\D/g, "");

    if (DIGITS.length !== 11) {
      throw new ValidationError("`CPF` must contain exactly 11 digits.");
    }

    if (ALL_SAME_DIGIT.test(DIGITS)) {
      throw new ValidationError(
        "`CPF` must not be a sequence of identical digits.",
      );
    }

    if (!CPF.isValid(DIGITS)) {
      throw new ValidationError("`CPF` must pass the check-digit algorithm.");
    }

    return new CPF({ value: DIGITS });
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether two `CPF` instances represent the same
   * taxpayer identification number.
   *
   * @param a - The first CPF.
   * @param b - The second CPF.
   * @returns `true` when both CPFs have equal values; otherwise, `false`.
   *
   * @example
   * ```ts
   * const A = CPF.create('52998224725')
   * const B = CPF.create('529.982.247-25')
   *
   * CPF.equals(A, B)
   * // true
   * ```
   */
  public static equals(a: CPF, b: CPF): boolean {
    return a.value === b.value;
  }

  // --------------------------------------
  // PRIVATE HELPERS
  // --------------------------------------

  /**
   * Validates the CPF check-digit algorithm.
   *
   * The algorithm computes two check digits using weighted sums
   * modulo 11 and compares them against the last two digits of
   * the CPF.
   *
   * @param digits - The 11-digit CPF string.
   * @returns `true` when the check digits are valid; otherwise, `false`.
   */
  private static isValid(digits: string): boolean {
    const FIRST_NINE = digits.substring(0, 9);

    const FIRST_CHECK = CPF.computeCheckDigit(FIRST_NINE, 10);

    const FIRST_TEN = FIRST_NINE + FIRST_CHECK;

    const SECOND_CHECK = CPF.computeCheckDigit(FIRST_TEN, 11);

    const EXPECTED = FIRST_CHECK + SECOND_CHECK;

    return digits.substring(9) === EXPECTED;
  }

  /**
   * Computes a single CPF check digit from the provided partial
   * digit string using the weighted-sum algorithm.
   *
   * @param partial - The partial digit string (9 or 10 digits).
   * @param weight - The starting weight (10 for the first check
   * digit, 11 for the second).
   * @returns The computed check digit as a string character.
   */
  private static computeCheckDigit(partial: string, weight: number): string {
    let SUM = 0;

    for (let INDEX = 0; INDEX < partial.length; INDEX++) {
      SUM += Number(partial[INDEX]) * (weight - INDEX);
    }

    const REMAINDER = SUM % 11;

    const DIGIT = REMAINDER < 2 ? "0" : String(11 - REMAINDER);

    return DIGIT;
  }
}

export default CPF;
