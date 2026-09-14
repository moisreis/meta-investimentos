import { EntityId } from "@/value-objects";
import { ValidationError } from "@/errors";

interface VerificationProps {
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @summary
 * Represents a one-time verification value tied to an identifier.
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
  private readonly _id?: EntityId;
  private readonly props: Required<VerificationProps>;

  /**
   * @summary
   * Returns the unique identifier of the verification.
   *
   * @remarks
   * Returns undefined if not yet persisted.
   *
   * @explanation
   * Use this to get the EntityId for persistence or comparison.
   *
   * @returns EntityId or undefined.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * @summary
   * Returns the identifier the verification is tied to.
   *
   * @remarks
   * The identifier string (e.g., "reset-password:email").
   *
   * @explanation
   * Use this to look up verifications by their target.
   *
   * @returns The identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get identifier(): string {
    return this.props.identifier;
  }

  /**
   * @summary
   * Returns the verification value.
   *
   * @remarks
   * The raw token or code value.
   *
   * @explanation
   * Use this to verify user-provided tokens.
   *
   * @returns The verification value string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get value(): string {
    return this.props.value;
  }

  /**
   * @summary
   * Returns the expiration date of the verification.
   *
   * @remarks
   * The Date after which the verification is invalid.
   *
   * @explanation
   * Use this to check if a verification is still valid.
   *
   * @returns Expiration Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  /**
   * @summary
   * Returns the creation timestamp of the verification.
   *
   * @remarks
   * Defaults to current time if not provided.
   *
   * @explanation
   * Use this for audit trails and ordering.
   *
   * @returns Creation Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * @summary
   * Returns the last update timestamp of the verification.
   *
   * @remarks
   * Defaults to current time if not provided.
   *
   * @explanation
   * Use this for audit trails.
   *
   * @returns Last update Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

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
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

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
   * Throws ValidationError if required fields are missing or blank.
   *
   * @param props - Properties required to create the verification.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Verification instance.
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
      throw new ValidationError("Verification must have an identifier.");
    }
    if (!props.value || props.value.trim() === "") {
      throw new ValidationError("Verification must have a value.");
    }
    if (!props.expiresAt) {
      throw new ValidationError("Verification must have an expiration date.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<VerificationProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Verification(NORMALIZED_PROPS, id);
  }

  /**
   * @summary
   * Compares this Verification with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use this to check if two Verification instances represent
   * the same persisted entity.
   *
   * @param object - The Verification to compare against.
   *
   * @returns True if both share the same ID.
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
