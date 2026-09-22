import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

interface VerificationProps {
  identifier: string
  value: string
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents a one-time verification value for an identifier.
 *
 * @remarks
 * Must have identifier, value, and expiration date.
 * Instances are immutable after creation.
 *
 * @explanation
 * Use this entity for password resets, email verification,
 * and other one-time token scenarios. It tracks expiration
 * and provides equality by ID.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Verification {
  private readonly _id?: EntityId
  private readonly props: Required<VerificationProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the verification.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare verifications.
   *
   * @returns EntityId or undefined.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get id(): EntityId | undefined {
    return this._id
  }

  /**
   * @summary
   * Returns the identifier the verification is tied to.
   *
   * @remarks
   * The identifier string (e.g., "reset-password:email").
   *
   * @explanation
   * Keys the verification to its target, such as a user email.
   *
   * @returns Identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get identifier(): string {
    return this.props.identifier
  }

  /**
   * @summary
   * Returns the verification value.
   *
   * @remarks
   * The raw token or code value.
   *
   * @explanation
   * Expected value compared against user-provided tokens.
   *
   * @returns Verification value.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get value(): string {
    return this.props.value
  }

  /**
   * @summary
   * Returns the expiration date of the verification.
   *
   * @remarks
   * The Date after which the verification is invalid.
   *
   * @explanation
   * Instant after which the verification is rejected.
   *
   * @returns Expiration Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get expiresAt(): Date {
    return new Date(this.props.expiresAt)
  }

  /**
   * @summary
   * Returns the creation timestamp of the verification.
   *
   * @remarks
   * Defaults to current time if not provided.
   *
   * @explanation
   * Orders records and supports audit trails.
   *
   * @returns Creation Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get createdAt(): Date {
    return new Date(this.props.createdAt)
  }

  /**
   * @summary
   * Returns the last update timestamp of the verification.
   *
   * @remarks
   * Defaults to current time if not provided.
   *
   * @explanation
   * Shows when the verification last changed.
   *
   * @returns Last update Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get updatedAt(): Date {
    return new Date(this.props.updatedAt)
  }

  // ---------------------------------
  // CONSTRUCTION
  // ---------------------------------

  /**
   * @summary
   * Creates a Verification instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Verification.create instead.
   *
   * @param props - Required verification properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<VerificationProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      expiresAt: new Date(props.expiresAt),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid Verification from the provided properties.
   *
   * @remarks
   * Validates identifier, value, and expiresAt.
   * Timestamps default to current time.
   *
   * @explanation
   * Factory method to construct a valid Verification.
   * Throws ValidationError if required fields are missing.
   *
   * @param props - Properties to create the verification.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Verification.
   *
   * @example
   * const VERIFICATION = Verification.create({
   *   identifier: "reset-password:jose@example.com",
   *   value: "reset-token",
   *   expiresAt: new Date("2026-02-01T00:00:00.000Z"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: VerificationProps, id?: string): Verification {
    if (!props.identifier || props.identifier.trim() === "") {
      throw new ValidationError("`Verification` must have an identifier.")
    }
    if (!props.value || props.value.trim() === "") {
      throw new ValidationError("`Verification` must have a value.")
    }
    if (!props.expiresAt) {
      throw new ValidationError("`Verification` must have an expiration date.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<VerificationProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Verification(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this Verification with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two verifications by their persisted identity.
   *
   * @param object - The Verification to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = Verification.create(PROPS, ID);
   * const B = Verification.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Verification | null): boolean {
    if (object == null || object === undefined) {
      return false
    }
    if (this === object) {
      return true
    }
    if (!this._id || !object._id) {
      return false
    }

    return this._id === object._id
  }
}
