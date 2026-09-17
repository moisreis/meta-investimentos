import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface WithdrawalReversedProps {
  withdrawalId: EntityId
  positionId: EntityId
  reversedAt: Date
  reversedByUserId: EntityId
  occurredAt?: Date
}

/**
 * @summary
 * Records the reversal of a fund withdrawal.
 *
 * @remarks
 * Emitted after the **Withdrawal** is reversed. It
 * carries the actor and the reversal timestamp.
 *
 * @explanation
 * Use this event to react to a cancelled capital outflow.
 * It is a lifecycle transition of the **Withdrawal**
 * that downstream contexts must recompute against.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class WithdrawalReversed {
  private readonly _id?: EntityId
  private readonly props: Required<WithdrawalReversedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the reversed withdrawal.
  get withdrawalId(): EntityId {
    return this.props.withdrawalId
  }

  // Returns the identifier of the target position.
  get positionId(): EntityId {
    return this.props.positionId
  }

  // Returns when the withdrawal was reversed.
  get reversedAt(): Date {
    return new Date(this.props.reversedAt)
  }

  // Returns the user who reversed the withdrawal.
  get reversedByUserId(): EntityId {
    return this.props.reversedByUserId
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<WithdrawalReversedProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      reversedAt: new Date(props.reversedAt),
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **WithdrawalReversed** event.
   *
   * @remarks
   * Validates the required fields and value objects.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **Withdrawal** is reversed. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the reversed withdrawal.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = WithdrawalReversed.create({
   *   withdrawalId: EntityId.create(
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
    props: WithdrawalReversedProps,
    id?: string
  ): WithdrawalReversed {
    if (!props.withdrawalId) {
      throw new ValidationError(
        "`WithdrawalReversed` must have a withdrawal id."
      )
    }
    if (!props.positionId) {
      throw new ValidationError(
        "`WithdrawalReversed` must have a position id."
      )
    }
    if (!props.reversedAt) {
      throw new ValidationError(
        "`WithdrawalReversed` must have a reversed date."
      )
    }
    if (!props.reversedByUserId) {
      throw new ValidationError(
        "`WithdrawalReversed` must have a user id."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<WithdrawalReversedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new WithdrawalReversed(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: WithdrawalReversed | null): boolean {
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