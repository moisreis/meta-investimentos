import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface UserProfileUpdatedProps {
  userId: EntityId
  name?: string | undefined
  firstName?: string | undefined
  lastName?: string | undefined
  image?: string | null | undefined
  occurredAt?: Date
}

type RequiredProps = {
  userId: EntityId
  name: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  image: string | null | undefined
  occurredAt: Date
}

/**
 * @summary
 * Updates the profile of an application user.
 *
 * @remarks
 * Emitted after the **User** profile is changed.
 * Carries only the fields that were updated.
 *
 * @explanation
 * Use this event to react to profile adjustments.
 * Optional fields identify which profile fields
 * were changed by the update.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class UserProfileUpdated {
  private readonly _id?: EntityId
  private readonly props: RequiredProps

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the updated user.
  get userId(): EntityId {
    return this.props.userId
  }

  // Returns the new full name, if changed.
  get name(): string | undefined {
    return this.props.name
  }

  // Returns the new first name, if changed.
  get firstName(): string | undefined {
    return this.props.firstName
  }

  // Returns the new last name, if changed.
  get lastName(): string | undefined {
    return this.props.lastName
  }

  // Returns the new profile image, if changed.
  get image(): string | null | undefined {
    return this.props.image
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(props: RequiredProps, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **UserProfileUpdated** event.
   *
   * @remarks
   * Validates the user identifier. Optional fields
   * default to undefined when not provided.
   *
   * @explanation
   * Factory method to build the event after the
   * **User** profile is changed. Throws a
   * **ValidationError** when the user id is missing.
   *
   * @param props - Properties of the updated profile.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = UserProfileUpdated.create({
   *   userId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   name: "Maria Souza",
   *   lastName: "Souza",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  public static create(
    props: UserProfileUpdatedProps,
    id?: string
  ): UserProfileUpdated {
    if (!props.userId) {
      throw new ValidationError(
        "`UserProfileUpdated` needs a user id."
      )
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      name: props.name,
      firstName: props.firstName,
      lastName: props.lastName,
      image: props.image,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new UserProfileUpdated(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: UserProfileUpdated | null): boolean {
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
