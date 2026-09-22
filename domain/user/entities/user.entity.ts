import { EntityId, type CPF } from "@/value-objects"
import { ValidationError } from "@/errors"

/**
 * @summary
 * User role type.
 *
 * @remarks
 * Either USER or MANAGER.
 *
 * @explanation
 * Use this type for role-based access control.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export type UserRole = "USER" | "MANAGER"

// Matches a valid email format for user validation.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface UserProps {
  name: string
  email: string
  firstName: string
  lastName: string
  cpf: CPF
  role?: UserRole
  emailVerified?: boolean
  image?: string | null
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents an application user.
 *
 * @remarks
 * Must have name, valid email, first/last name, **CPF**.
 * Instances are immutable after creation.
 *
 * @explanation
 * Core user entity for authentication and profiles.
 * It holds registration data and role-based access.
 * Provides a masked **CPF** to protect personal data.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class User {
  private readonly _id?: EntityId
  private readonly props: Required<UserProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the user.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare users.
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
   * Returns the full name of the user.
   *
   * @remarks
   * The complete display name.
   *
   * @explanation
   * Identifies the user in lists and profile views.
   *
   * @returns Full name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get name(): string {
    return this.props.name
  }

  /**
   * @summary
   * Returns the email of the user.
   *
   * @remarks
   * Validated email address.
   *
   * @explanation
   * Used for login and notification delivery.
   *
   * @returns Email string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get email(): string {
    return this.props.email
  }

  /**
   * @summary
   * Returns the first name of the user.
   *
   * @remarks
   * The given name.
   *
   * @explanation
   * Use for personalized greetings.
   *
   * @returns First name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get firstName(): string {
    return this.props.firstName
  }

  /**
   * @summary
   * Returns the last name of the user.
   *
   * @remarks
   * The family name.
   *
   * @explanation
   * Use for formal communications.
   *
   * @returns Last name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get lastName(): string {
    return this.props.lastName
  }

  /**
   * @summary
   * Returns the **CPF** of the user.
   *
   * @remarks
   * Validated **CPF** value object.
   *
   * @explanation
   * Used for Brazilian tax identification.
   *
   * @returns **CPF** value object.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get cpf(): CPF {
    return this.props.cpf
  }

  /**
   * @summary
   * Returns a masked representation of the user's **CPF**.
   *
   * @remarks
   * Shows first 3 and last 2 digits only.
   *
   * @explanation
   * Use for display while protecting personal data.
   *
   * @returns Masked **CPF** string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get maskedCpf(): string {
    const VALUE = this.props.cpf.value
    return `${VALUE.slice(0, 3)}.***.***-${VALUE.slice(-2)}`
  }

  /**
   * @summary
   * Returns the role of the user.
   *
   * @remarks
   * Either USER or MANAGER.
   *
   * @explanation
   * Use for authorization decisions.
   *
   * @returns UserRole value.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get role(): UserRole {
    return this.props.role
  }

  /**
   * @summary
   * Returns whether the user's email was verified.
   *
   * @remarks
   * Boolean flag, defaults to false.
   *
   * @explanation
   * Use to gate features requiring verified email.
   *
   * @returns True if email verified.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get emailVerified(): boolean {
    return this.props.emailVerified
  }

  /**
   * @summary
   * Returns the profile image URL of the user.
   *
   * @remarks
   * Nullable string URL.
   *
   * @explanation
   * Use for avatar display.
   *
   * @returns Image URL or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get image(): string | null {
    return this.props.image
  }

  /**
   * @summary
   * Returns the creation timestamp of the user.
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
   * Returns the last update timestamp of the user.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Shows when the profile last changed.
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
   * Creates a User instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use User.create instead.
   *
   * @param props - Required user properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<UserProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid User from the provided properties.
   *
   * @remarks
   * Validates name, email, firstName, lastName, **CPF**, role.
   * Defaults applied for optional fields.
   *
   * @explanation
   * Factory method to construct a valid User.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the user.
   * @param id - Optional unique identifier.
   *
   * @returns Valid User instance.
   *
   * @example
   * const USER = User.create({
   *   name: "José da Silva",
   *   email: "jose@example.com",
   *   firstName: "José",
   *   lastName: "da Silva",
   *   cpf: CPF.create("24301457030"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: UserProps, id?: string): User {
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("`User` must have a name.")
    }
    if (!props.email || !EMAIL_PATTERN.test(props.email)) {
      throw new ValidationError("`User` must have a valid email.")
    }
    if (!props.firstName || props.firstName.trim() === "") {
      throw new ValidationError("`User` must have a first name.")
    }
    if (!props.lastName || props.lastName.trim() === "") {
      throw new ValidationError("`User` must have a last name.")
    }
    if (!props.cpf) {
      throw new ValidationError("`User` must have a valid cpf.")
    }
    if (
      props.role !== undefined &&
      props.role !== "USER" &&
      props.role !== "MANAGER"
    ) {
      throw new ValidationError("`User` must have a valid role.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<UserProps> = {
      ...props,
      role: props.role ?? "USER",
      emailVerified: props.emailVerified ?? false,
      image: props.image ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new User(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // MUTATIONS
  // ---------------------------------

  /**
   * @summary
   * Updates the profile fields of this user.
   *
   * @remarks
   * Only provided fields are replaced; updatedAt refreshed.
   *
   * @explanation
   * Returns new User instance with updated profile.
   * Original instance unchanged.
   *
   * @param props - Profile fields to update.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns Updated User instance.
   *
   * @example
   * const UPDATED = user.updateProfile({
   *   name: "José Silva",
   *   image: "https://example.com/avatar.jpg",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public updateProfile(
    props: {
      name?: string
      firstName?: string
      lastName?: string
      image?: string | null
    },
    now?: Date
  ): User {
    const name = props.name ?? this.props.name
    const firstName = props.firstName ?? this.props.firstName
    const lastName = props.lastName ?? this.props.lastName
    const image = props.image === undefined ? this.props.image : props.image

    if (name.trim() === "") {
      throw new ValidationError("`User` must have a name.")
    }
    if (firstName.trim() === "") {
      throw new ValidationError("`User` must have a first name.")
    }
    if (lastName.trim() === "") {
      throw new ValidationError("`User` must have a last name.")
    }

    const NOW = now ?? new Date()

    return new User(
      {
        ...this.props,
        name,
        firstName,
        lastName,
        image,
        updatedAt: NOW,
      },
      this._id
    )
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this User with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two users by their persisted identity.
   *
   * @param object - The User to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = User.create(PROPS, ID);
   * const B = User.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: User | null): boolean {
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
