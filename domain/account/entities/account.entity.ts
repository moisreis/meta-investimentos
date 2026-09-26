import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

interface AccountProps {
  providerId: string
  accountId: string
  userId: EntityId
  accessToken?: string | null
  refreshToken?: string | null
  idToken?: string | null
  accessTokenExpiresAt?: Date | null
  refreshTokenExpiresAt?: Date | null
  scope?: string | null
  password?: string | null
  createdAt?: Date
  updatedAt?: Date
  issuer?: string
}

/**
 * @summary
 * Represents an authentication account linked to a user.
 *
 * @remarks
 * Must have issuer, providerId, accountId, userId.
 * Instances are immutable after creation.
 *
 * @explanation
 * Stores **OAuth** and credential accounts for user
 * authentication. Supports multiple providers per user.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Account {
  private readonly _id?: EntityId
  private readonly props: Required<AccountProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the account.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare accounts.
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
   * Returns the issuer of the account.
   *
   * @remarks
   * **OAuth** provider name.
   *
   * @explanation
   * Identifies the authentication server that issued the
   * account. The auth client uses it for token renewal.
   *
   * @returns Issuer string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get issuer(): string {
    return this.props.issuer ?? "better-auth"
  }

  /**
   * @summary
   * Returns the provider ID of the account.
   *
   * @remarks
   * Provider-specific identifier.
   *
   * @explanation
   * Maps this account to its identity on the provider.
   *
   * @returns Provider ID string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get providerId(): string {
    return this.props.providerId
  }

  /**
   * @summary
   * Returns the account ID provided by the issuer.
   *
   * @remarks
   * Unique ID from the **OAuth** provider.
   *
   * @explanation
   * Links the account to the provider's user record.
   *
   * @returns Account ID string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get accountId(): string {
    return this.props.accountId
  }

  /**
   * @summary
   * Returns the ID of the user the account belongs to.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Binds the account to the owning application user.
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
   * Returns the access token of the account.
   *
   * @remarks
   * Nullable string.
   *
   * @explanation
   * Use for **API** calls that run on behalf of the user.
   *
   * @returns Access token or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get accessToken(): string | null {
    return this.props.accessToken
  }

  /**
   * @summary
   * Returns the refresh token of the account.
   *
   * @remarks
   * Nullable string.
   *
   * @explanation
   * Use to obtain new access tokens.
   *
   * @returns Refresh token or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get refreshToken(): string | null {
    return this.props.refreshToken
  }

  /**
   * @summary
   * Returns the ID token of the account.
   *
   * @remarks
   * Nullable string (**OIDC**).
   *
   * @explanation
   * Use for identity verification.
   *
   * @returns ID token or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get idToken(): string | null {
    return this.props.idToken
  }

  /**
   * @summary
   * Returns the expiration date of the access token.
   *
   * @remarks
   * Nullable Date.
   *
   * @explanation
   * Use to check token validity.
   *
   * @returns Expiration Date or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get accessTokenExpiresAt(): Date | null {
    return this.props.accessTokenExpiresAt
      ? new Date(this.props.accessTokenExpiresAt)
      : null
  }

  /**
   * @summary
   * Returns the expiration date of the refresh token.
   *
   * @remarks
   * Nullable Date.
   *
   * @explanation
   * Use to check refresh token validity.
   *
   * @returns Expiration Date or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get refreshTokenExpiresAt(): Date | null {
    return this.props.refreshTokenExpiresAt
      ? new Date(this.props.refreshTokenExpiresAt)
      : null
  }

  /**
   * @summary
   * Returns the scope granted to the account.
   *
   * @remarks
   * Nullable string.
   *
   * @explanation
   * Use for permission checks.
   *
   * @returns Scope string or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get scope(): string | null {
    return this.props.scope
  }

  /**
   * @summary
   * Returns the password hash of the account.
   *
   * @remarks
   * Nullable string (for credentials auth).
   *
   * @explanation
   * Use for password-based authentication.
   *
   * @returns Password hash or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get password(): string | null {
    return this.props.password
  }

  /**
   * @summary
   * Returns the creation timestamp of the account.
   *
   * @remarks
   * Defaults to current time.
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
   * Returns the last update timestamp of the account.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Shows when the account last changed.
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
   * Creates an Account instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Account.create instead.
   *
   * @param props - Required account properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(
    props: Required<AccountProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      accessTokenExpiresAt: props.accessTokenExpiresAt
        ? new Date(props.accessTokenExpiresAt)
        : null,
      refreshTokenExpiresAt: props.refreshTokenExpiresAt
        ? new Date(props.refreshTokenExpiresAt)
        : null,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid Account from the provided properties.
   *
   * @remarks
   * Validates issuer, providerId, accountId, userId.
   * Defaults for optional fields.
   *
   * @explanation
   * Factory method to construct a valid Account.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the account.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Account instance.
   *
   * @example
   * const ACCOUNT = Account.create({
   *   issuer: "github",
   *   providerId: "github",
   *   accountId: "octocat",
   *   userId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: AccountProps,
    id?: string
  ): Account {
    if (!props.providerId || props.providerId.trim() === "") {
      throw new ValidationError(
        "`Account` must have a provider id."
      )
    }
    if (!props.accountId || props.accountId.trim() === "") {
      throw new ValidationError(
        "`Account` must have an account id."
      )
    }
    if (!props.userId || props.userId.trim() === "") {
      throw new ValidationError("`Account` must have a user id.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<AccountProps> = {
      ...props,
      issuer: props.issuer ?? "better-auth",
      accessToken: props.accessToken ?? null,
      refreshToken: props.refreshToken ?? null,
      idToken: props.idToken ?? null,
      accessTokenExpiresAt: props.accessTokenExpiresAt ?? null,
      refreshTokenExpiresAt: props.refreshTokenExpiresAt ?? null,
      scope: props.scope ?? null,
      password: props.password ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Account(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this Account with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two accounts by their persisted identity.
   *
   * @param object - The Account to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = Account.create(PROPS, ID);
   * const B = Account.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Account | null): boolean {
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
