import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

interface SessionProps {
  userId: EntityId
  token: string
  expiresAt: Date
  ipAddress?: string | null
  userAgent?: string | null
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents an authentication session of a user.
 *
 * @remarks
 * Must have user ID, token, and expiration date.
 * Instances are immutable after creation.
 *
 * @explanation
 * Tracks user login sessions with metadata.
 * Provides equality by ID.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Session {
  private readonly _id?: EntityId
  private readonly props: Required<SessionProps>

  /**
   * @summary
   * Returns the unique identifier of the session.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Use for persistence and equality checks.
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
   * Returns the ID of the user the session belongs to.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to associate session with user.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get userId(): EntityId {
    return this.props.userId
  }

  /**
   * @summary
   * Returns the token of the session.
   *
   * @remarks
   * The session token string.
   *
   * @explanation
   * Use for authentication validation.
   *
   * @returns Token string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get token(): string {
    return this.props.token
  }

  /**
   * @summary
   * Returns the expiration date of the session.
   *
   * @remarks
   * Date after which session is invalid.
   *
   * @explanation
   * Use to check session validity.
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
   * Returns the IP address the session was created from.
   *
   * @remarks
   * Nullable string.
   *
   * @explanation
   * Use for security auditing.
   *
   * @returns IP address or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get ipAddress(): string | null {
    return this.props.ipAddress
  }

  /**
   * @summary
   * Returns the user agent of the session.
   *
   * @remarks
   * Nullable string.
   *
   * @explanation
   * Use for device identification.
   *
   * @returns User agent or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get userAgent(): string | null {
    return this.props.userAgent
  }

  /**
   * @summary
   * Returns the creation timestamp of the session.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Use for audit and ordering.
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
   * Returns the last update timestamp of the session.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Use for audit.
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

  /**
   * @summary
   * Creates a Session instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Session.create instead.
   *
   * @param props - Required session properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<SessionProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      expiresAt: new Date(props.expiresAt),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    })
  }

  /**
   * @summary
   * Creates a valid Session from the provided properties.
   *
   * @remarks
   * Validates userId, token, and expiresAt.
   * Defaults for optional fields.
   *
   * @explanation
   * Factory method to construct a valid Session.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the session.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Session instance.
   *
   * @example
   * const SESSION = Session.create({
   *   userId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   *   token: "session-token",
   *   expiresAt: new Date("2026-02-01T00:00:00.000Z"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: SessionProps, id?: string): Session {
    if (!props.userId || props.userId.trim() === "") {
      throw new ValidationError("`Session` must have a user id.")
    }
    if (!props.token || props.token.trim() === "") {
      throw new ValidationError("`Session` must have a token.")
    }
    if (!props.expiresAt) {
      throw new ValidationError("`Session` must have an expiration date.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<SessionProps> = {
      ...props,
      ipAddress: props.ipAddress ?? null,
      userAgent: props.userAgent ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Session(NORMALIZED_PROPS, id)
  }

  /**
   * @summary
   * Compares this Session with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two Session instances represent same entity.
   *
   * @param object - The Session to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = Session.create(PROPS, ID);
   * const B = Session.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Session | null): boolean {
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
