/**
 * Represents the properties required to create a {@link Session}.
 *
 * The `ipAddress` and `userAgent` default to `null`, and the timestamps
 * default to the current time when not provided.
 *
 * Use {@link Session.create} to create a valid `Session` instance.
 */
interface SessionProps {
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents an authentication session of a user.
 *
 * A `Session`:
 * - must have a user id.
 * - must have a token.
 * - must have an expiration date.
 *
 * `Session` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const SESSION = Session.create({
 *   userId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   token: 'session-token',
 *   expiresAt: new Date('2026-02-01T00:00:00.000Z'),
 * })
 *
 * SESSION.token
 * // 'session-token'
 * ```
 */
export class Session {
  private readonly _id?: string;
  private readonly props: Required<SessionProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the session.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the id of the user the session belongs to.
   */
  get userId(): string {
    return this.props.userId;
  }

  /**
   * Returns the token of the session.
   */
  get token(): string {
    return this.props.token;
  }

  /**
   * Returns the expiration date of the session.
   */
  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  /**
   * Returns the ip address the session was created from.
   */
  get ipAddress(): string | null {
    return this.props.ipAddress;
  }

  /**
   * Returns the user agent of the session.
   */
  get userAgent(): string | null {
    return this.props.userAgent;
  }

  /**
   * Returns the creation timestamp of the session.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the session.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `Session`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Session.create} and therefore satisfy the
   * session's invariants.
   */
  private constructor(props: Required<SessionProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `Session` from the provided properties.
   *
   * The `ipAddress` and `userAgent` default to `null`, and the
   * timestamps to the current time when those properties are not
   * provided.
   *
   * @param props - The properties required to create the session.
   * @param id - The unique identifier of the session.
   *
   * @returns A valid `Session` instance.
   *
   * @throws {Error} If `props.userId` is blank.
   * @throws {Error} If `props.token` is blank.
   * @throws {Error} If `props.expiresAt` is missing.
   */
  public static create(props: SessionProps, id?: string): Session {
    if (!props.userId || props.userId.trim() === "") {
      throw new Error("Session must have a user id.");
    }
    if (!props.token || props.token.trim() === "") {
      throw new Error("Session must have a token.");
    }
    if (!props.expiresAt) {
      throw new Error("Session must have an expiration date.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<SessionProps> = {
      ...props,
      ipAddress: props.ipAddress ?? null,
      userAgent: props.userAgent ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Session(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `Session` represents the same session as
   * the provided instance, based on referential equality and the
   * unique id.
   *
   * @param object - The session to compare against.
   * @returns `true` when both sessions share the same id; otherwise, `false`.
   */
  public equals(object?: Session | null): boolean {
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
