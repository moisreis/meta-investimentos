import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface ApplicationReversedProps {
  applicationId: EntityId
  positionId: EntityId
  reversedAt: Date
  reversedByUserId: EntityId
  occurredAt?: Date
}

/**
 * @summary
 * Records the reversal of a fund application.
 *
 * @remarks
 * Emitted after the **Application** is reversed. It
 * carries the actor and the reversal timestamp.
 *
 * @explanation
 * Use this event to react to a cancelled capital inflow.
 * It is a lifecycle transition of the **Application**
 * that downstream contexts must recompute against.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class ApplicationReversed {
  private readonly _id?: EntityId
  private readonly props: Required<ApplicationReversedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the reversed application.
  get applicationId(): EntityId {
    return this.props.applicationId
  }

  // Returns the identifier of the target position.
  get positionId(): EntityId {
    return this.props.positionId
  }

  // Returns when the application was reversed.
  get reversedAt(): Date {
    return new Date(this.props.reversedAt)
  }

  // Returns the user who reversed the application.
  get reversedByUserId(): EntityId {
    return this.props.reversedByUserId
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(props: Required<ApplicationReversedProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      reversedAt: new Date(props.reversedAt),
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **ApplicationReversed** event.
   *
   * @remarks
   * Validates the required fields and value objects.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **Application** is reversed. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the reversed application.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = ApplicationReversed.create({
   *   applicationId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   positionId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   reversedAt: new Date("2026-01-11T00:00:00.000Z"),
   *   reversedByUserId: EntityId.create(
   *     "323e4567-e89b-42d3-a456-426614174000"
   *   ),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: ApplicationReversedProps,
    id?: string
  ): ApplicationReversed {
    if (!props.applicationId) {
      throw new ValidationError(
        "`ApplicationReversed` must have an application id."
      )
    }
    if (!props.positionId) {
      throw new ValidationError("`ApplicationReversed` needs a position id.")
    }
    if (!props.reversedAt) {
      throw new ValidationError("`ApplicationReversed` needs a reversed date.")
    }
    if (!props.reversedByUserId) {
      throw new ValidationError("`ApplicationReversed` needs a user id.")
    }

    const NOW = new Date()

    type RequiredProps = Required<ApplicationReversedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new ApplicationReversed(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: ApplicationReversed | null): boolean {
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
