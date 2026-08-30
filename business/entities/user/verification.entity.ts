/**
 * Represents the properties required to create a {@link Verification}.
 *
 * The timestamps default to the current time when not provided.
 *
 * Use {@link Verification.create} to create a valid `Verification`
 * instance.
 */
interface VerificationProps {
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a one-time verification value tied to an identifier.
 *
 * A `Verification`:
 * - must have an identifier.
 * - must have a value.
 * - must have an expiration date.
 *
 * `Verification` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const VERIFICATION = Verification.create({
 *   identifier: 'reset-password:jose@example.com',
 *   value: 'reset-token',
 *   expiresAt: new Date('2026-02-01T00:00:00.000Z'),
 * })
 *
 * VERIFICATION.identifier
 * // 'reset-password:jose@example.com'
 * ```
 */
export class Verification {
  private readonly _id?: string;
  private readonly props: Required<VerificationProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the verification.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the identifier the verification is tied to.
   */
  get identifier(): string {
    return this.props.identifier;
  }

  /**
   * Returns the verification value.
   */
  get value(): string {
    return this.props.value;
  }

  /**
   * Returns the expiration date of the verification.
   */
  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  /**
   * Returns the creation timestamp of the verification.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the verification.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `Verification`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Verification.create} and therefore satisfy
   * the verification's invariants.
   */
  private constructor(props: Required<VerificationProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `Verification` from the provided properties.
   *
   * The timestamps default to the current time when not provided.
   *
   * @param props - The properties required to create the verification.
   * @param id - The unique identifier of the verification.
   *
   * @returns A valid `Verification` instance.
   *
   * @throws {Error} If `props.identifier` is blank.
   * @throws {Error} If `props.value` is blank.
   * @throws {Error} If `props.expiresAt` is missing.
   */
  public static create(props: VerificationProps, id?: string): Verification {
    if (!props.identifier || props.identifier.trim() === "") {
      throw new Error("Verification must have an identifier.");
    }
    if (!props.value || props.value.trim() === "") {
      throw new Error("Verification must have a value.");
    }
    if (!props.expiresAt) {
      throw new Error("Verification must have an expiration date.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<VerificationProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Verification(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `Verification` represents the same
   * verification as the provided instance, based on referential
   * equality and the unique id.
   *
   * @param object - The verification to compare against.
   * @returns `true` when both verifications share the same id;
   * otherwise, `false`.
   */
  public equals(object?: Verification | null): boolean {
    if (object == null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!this._id || !object._id) {
      return false;
    }

    return this._id === object._id;
  }
}
