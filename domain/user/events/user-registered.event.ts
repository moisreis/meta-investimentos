import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"
import type { UserRole } from "@domain/user/entities/user.entity"

export interface UserRegisteredProps {
  userId: EntityId
  name: string
  email: string
  firstName: string
  lastName: string
  maskedCpf: string
  role?: UserRole
  emailVerified?: boolean
  occurredAt?: Date
}

/**
 * @summary
 * Registers a new application user.
 *
 * @remarks
 * Emitted after the **User** entity is persisted.
 * Carries the registration profile and the role.
 *
 * @explanation
 * Use this event to react to new user creation. It
 * exposes the profile snapshot consumed by downstream
 * contexts for onboarding, audit, and access control.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class UserRegistered {
  private readonly _id?: EntityId
  private readonly props: Required<UserRegisteredProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the registered user.
  get userId(): EntityId {
    return this.props.userId
  }

  // Returns the full name of the registered user.
  get name(): string {
    return this.props.name
  }

  // Returns the email of the registered user.
  get email(): string {
    return this.props.email
  }

  // Returns the first name of the registered user.
  get firstName(): string {
    return this.props.firstName
  }

  // Returns the last name of the registered user.
  get lastName(): string {
    return this.props.lastName
  }

  // Returns the masked CPF of the registered user.
  get maskedCpf(): string {
    return this.props.maskedCpf
  }

  // Returns the role of the registered user.
  get role(): UserRole {
    return this.props.role
  }

  // Returns whether the user's email was verified.
  get emailVerified(): boolean {
    return this.props.emailVerified
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<UserRegisteredProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **UserRegistered** event.
   *
   * @remarks
   * Validates the required registration fields. The
   * role and the verified flag default when omitted.
   *
   * @explanation
   * Factory method to build the event after the
   * **User** is stored. Throws a **ValidationError**
   * when a required field is missing or the role is
   * not a valid **UserRole**.
   *
   * @param props - Properties of the registered user.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = UserRegistered.create({
   *   userId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   name: "Maria Silva",
   *   email: "maria@example.com",
   *   firstName: "Maria",
   *   lastName: "Silva",
   *   maskedCpf: "123.***.***-09",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  public static create(
    props: UserRegisteredProps,
    id?: string
  ): UserRegistered {
    if (!props.userId) {
      throw new ValidationError(
        "`UserRegistered` must have a user id."
      )
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError(
        "`UserRegistered` must have a name."
      )
    }
    if (!props.email) {
      throw new ValidationError(
        "`UserRegistered` must have an email."
      )
    }
    if (!props.firstName || props.firstName.trim() === "") {
      throw new ValidationError(
        "`UserRegistered` must have a first name."
      )
    }
    if (!props.lastName || props.lastName.trim() === "") {
      throw new ValidationError(
        "`UserRegistered` must have a last name."
      )
    }
    if (!props.maskedCpf) {
      throw new ValidationError(
        "`UserRegistered` must have a masked cpf."
      )
    }
    if (
      props.role !== undefined &&
      props.role !== "USER" &&
      props.role !== "MANAGER"
    ) {
      throw new ValidationError(
        "`UserRegistered` must have a valid role."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<UserRegisteredProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      role: props.role ?? "USER",
      emailVerified: props.emailVerified ?? false,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new UserRegistered(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: UserRegistered | null): boolean {
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
