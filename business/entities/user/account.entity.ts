import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create an {@link Account}.
 *
 * The token fields, token expiration dates, scope, and password default
 * to `null`, and the timestamps default to the current time when not
 * provided.
 *
 * Use {@link Account.create} to create a valid `Account` instance.
 */
interface AccountProps {
  issuer: string;
  providerId: string;
  accountId: string;
  userId: EntityId;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  password?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents an authentication account linked to a user.
 *
 * An `Account`:
 * - must have an issuer.
 * - must have a provider id.
 * - must have an account id.
 * - must have a user id.
 *
 * `Account` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const ACCOUNT = Account.create({
 *   issuer: 'github',
 *   providerId: 'github',
 *   accountId: 'octocat',
 *   userId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 * })
 *
 * ACCOUNT.issuer
 * // 'github'
 * ```
 */
export class Account {
  private readonly _id?: EntityId;
  private readonly props: Required<AccountProps>;

  /**
   * Returns the unique identifier of the account.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the issuer of the account.
   */
  get issuer(): string {
    return this.props.issuer;
  }

  /**
   * Returns the provider id of the account.
   */
  get providerId(): string {
    return this.props.providerId;
  }

  /**
   * Returns the account id provided by the issuer.
   */
  get accountId(): string {
    return this.props.accountId;
  }

  /**
   * Returns the id of the user the account belongs to.
   */
  get userId(): EntityId {
    return this.props.userId;
  }

  /**
   * Returns the access token of the account.
   */
  get accessToken(): string | null {
    return this.props.accessToken;
  }

  /**
   * Returns the refresh token of the account.
   */
  get refreshToken(): string | null {
    return this.props.refreshToken;
  }

  /**
   * Returns the id token of the account.
   */
  get idToken(): string | null {
    return this.props.idToken;
  }

  /**
   * Returns the expiration date of the access token.
   */
  get accessTokenExpiresAt(): Date | null {
    return this.props.accessTokenExpiresAt;
  }

  /**
   * Returns the expiration date of the refresh token.
   */
  get refreshTokenExpiresAt(): Date | null {
    return this.props.refreshTokenExpiresAt;
  }

  /**
   * Returns the scope granted to the account.
   */
  get scope(): string | null {
    return this.props.scope;
  }

  /**
   * Returns the password hash of the account.
   */
  get password(): string | null {
    return this.props.password;
  }

  /**
   * Returns the creation timestamp of the account.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the account.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Creates an `Account`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Account.create} and therefore satisfy the
   * account's invariants.
   */
  private constructor(props: Required<AccountProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `Account` from the provided properties.
   *
   * The token fields, token expiration dates, scope, and password
   * default to `null`, and the timestamps to the current time when
   * those properties are not provided.
   *
   * @param props - The properties required to create the account.
   * @param id - The unique identifier of the account.
   *
   * @returns A valid `Account` instance.
   *
   * @throws {ValidationError} If `props.issuer` is blank.
   * @throws {ValidationError} If `props.providerId` is blank.
   * @throws {ValidationError} If `props.accountId` is blank.
   * @throws {ValidationError} If `props.userId` is blank.
   */
  public static create(props: AccountProps, id?: string): Account {
    if (!props.issuer || props.issuer.trim() === "") {
      throw new ValidationError("Account must have an issuer.");
    }
    if (!props.providerId || props.providerId.trim() === "") {
      throw new ValidationError("Account must have a provider id.");
    }
    if (!props.accountId || props.accountId.trim() === "") {
      throw new ValidationError("Account must have an account id.");
    }
    if (!props.userId || props.userId.trim() === "") {
      throw new ValidationError("Account must have a user id.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<AccountProps> = {
      ...props,
      accessToken: props.accessToken ?? null,
      refreshToken: props.refreshToken ?? null,
      idToken: props.idToken ?? null,
      accessTokenExpiresAt: props.accessTokenExpiresAt ?? null,
      refreshTokenExpiresAt: props.refreshTokenExpiresAt ?? null,
      scope: props.scope ?? null,
      password: props.password ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Account(NORMALIZED_PROPS, id);
  }

  /**
   * Determines whether this `Account` represents the same account as
   * the provided instance, based on referential equality and the
   * unique id.
   *
   * @param object - The account to compare against.
   * @returns `true` when both accounts share the same id; otherwise, `false`.
   */
  public equals(object?: Account | null): boolean {
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
