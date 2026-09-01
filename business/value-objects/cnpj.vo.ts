import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties of a {@link CNPJ}.
 */
interface CNPJProps {
  value: string;
}

const ALL_SAME_DIGIT = /^(\d)\1{13}$/;

const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Value object representing a Brazilian CNPJ (Cadastro Nacional da
 * Pessoa Jurídica) — the corporate taxpayer identification number.
 *
 * A `CNPJ`:
 * - must be defined.
 * - must not be blank.
 * - must contain exactly 14 digits after stripping non-digit characters.
 * - must not be a sequence of identical digits.
 * - must pass the official check-digit algorithm.
 *
 * The value is stored with only digits, stripped of any formatting
 * characters (dots, dashes, slashes, spaces).
 *
 * `CNPJ` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const CNPJ = CNPJ.create('12.345.678/0001-95')
 *
 * CNPJ.value
 * // '12345678000195'
 * ```
 *
 * @example
 * ```ts
 * const A = CNPJ.create('12345678000195')
 * const B = CNPJ.create('12.345.678/0001-95')
 *
 * CNPJ.equals(A, B)
 * // true
 * ```
 */
class CNPJ {
  private readonly props: CNPJProps;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the CNPJ value with only digits.
   */
  get value(): string {
    return this.props.value;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `CNPJ`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link CNPJ.create} and therefore
   * satisfy the CNPJ's invariants.
   */
  private constructor(props: CNPJProps) {
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `CNPJ` from the provided value.
   *
   * The value may contain formatting characters (dots, dashes,
   * slashes, spaces), which are stripped before validation. The
   * resulting value contains only digits.
   *
   * @param value - The CNPJ string to validate and create.
   * @returns A valid `CNPJ` instance.
   *
   * @throws {ValidationError} If `value` is `undefined` or `null`.
   * @throws {ValidationError} If `value` is blank.
   * @throws {ValidationError} If `value` does not contain exactly 14 digits.
   * @throws {ValidationError} If `value` is a sequence of identical digits.
   * @throws {ValidationError} If `value` does not pass the check-digit algorithm.
   *
   * @example
   * ```ts
   * const CNPJ = CNPJ.create('12.345.678/0001-95')
   *
   * CNPJ.value
   * // '12345678000195'
   * ```
   */
  public static create(value: string): CNPJ {
    if (value === undefined || value === null) {
      throw new ValidationError("`CNPJ` must be defined.");
    }

    if (value.trim() === "") {
      throw new ValidationError("`CNPJ` must not be blank.");
    }

    const DIGITS = value.replace(/\D/g, "");

    if (DIGITS.length !== 14) {
      throw new ValidationError("`CNPJ` must contain exactly 14 digits.");
    }

    if (ALL_SAME_DIGIT.test(DIGITS)) {
      throw new ValidationError(
        "`CNPJ` must not be a sequence of identical digits.",
      );
    }

    if (!CNPJ.isValid(DIGITS)) {
      throw new ValidationError("`CNPJ` must pass the check-digit algorithm.");
    }

    return new CNPJ({ value: DIGITS });
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether two `CNPJ` instances represent the same
   * corporate identification number.
   *
   * @param a - The first CNPJ.
   * @param b - The second CNPJ.
   * @returns `true` when both CNPJs have equal values; otherwise,
   * `false`.
   *
   * @example
   * ```ts
   * const A = CNPJ.create('12345678000195')
   * const B = CNPJ.create('12.345.678/0001-95')
   *
   * CNPJ.equals(A, B)
   * // true
   * ```
   */
  public static equals(a: CNPJ, b: CNPJ): boolean {
    return a.value === b.value;
  }

  // --------------------------------------
  // PRIVATE HELPERS
  // --------------------------------------

  /**
   * Validates the CNPJ check-digit algorithm.
   *
   * The algorithm computes two check digits using weighted sums
   * modulo 11 and compares them against the last two digits of
   * the CNPJ.
   *
   * @param digits - The 14-digit CNPJ string.
   * @returns `true` when the check digits are valid; otherwise, `false`.
   */
  private static isValid(digits: string): boolean {
    const FIRST_TWELVE = digits.substring(0, 12);

    const FIRST_CHECK = CNPJ.computeCheckDigit(FIRST_TWELVE, FIRST_WEIGHTS);

    const FIRST_THIRTEEN = FIRST_TWELVE + FIRST_CHECK;

    const SECOND_CHECK = CNPJ.computeCheckDigit(FIRST_THIRTEEN, SECOND_WEIGHTS);

    const EXPECTED = FIRST_CHECK + SECOND_CHECK;

    return digits.substring(12) === EXPECTED;
  }

  /**
   * Computes a single CNPJ check digit from the provided partial
   * digit string using the weighted-sum algorithm.
   *
   * @param partial - The partial digit string (12 or 13 digits).
   * @param weights - The weight array corresponding to the
   * partial length.
   * @returns The computed check digit as a string character.
   */
  private static computeCheckDigit(partial: string, weights: number[]): string {
    let SUM = 0;

    for (let INDEX = 0; INDEX < partial.length; INDEX++) {
      SUM += Number(partial[INDEX]) * weights[INDEX];
    }

    const REMAINDER = SUM % 11;

    const DIGIT = REMAINDER < 2 ? "0" : String(11 - REMAINDER);

    return DIGIT;
  }
}

export default CNPJ;
