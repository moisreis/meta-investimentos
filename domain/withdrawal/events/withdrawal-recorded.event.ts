import {
  EntityId,
  type PositiveMoney,
  type QuotaQuantity,
} from "@/value-objects"
import { ValidationError } from "@/errors"

export interface WithdrawalRecordedProps {
  withdrawalId: EntityId
  positionId: EntityId
  fundId: EntityId
  date: Date
  amount: PositiveMoney
  quotas: QuotaQuantity
  occurredAt?: Date
}

/**
 * @summary
 * Records a fund withdrawal from a position.
 *
 * @remarks
 * Emitted after the **Withdrawal** entity is persisted.
 * Carries the withdrawn amount and the removed quotas.
 *
 * @explanation
 * Use this event to react to capital outflow from a fund
 * holding. It represents a meaningful business action
 * that downstream contexts consume for performance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class WithdrawalRecorded {
  private readonly _id?: EntityId
  private readonly props: Required<WithdrawalRecordedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the recorded withdrawal.
  get withdrawalId(): EntityId {
    return this.props.withdrawalId
  }

  // Returns the identifier of the target position.
  get positionId(): EntityId {
    return this.props.positionId
  }

  // Returns the identifier of the target fund.
  get fundId(): EntityId {
    return this.props.fundId
  }

  // Returns the date when the withdrawal was made.
  get date(): Date {
    return new Date(this.props.date)
  }

  // Returns the amount withdrawn from the fund.
  get amount(): PositiveMoney {
    return this.props.amount
  }

  // Returns the quotas removed by the withdrawal.
  get quotas(): QuotaQuantity {
    return this.props.quotas
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<WithdrawalRecordedProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      date: new Date(props.date),
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **WithdrawalRecorded** event.
   *
   * @remarks
   * Validates the required fields and value objects.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **Withdrawal** is stored. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the recorded withdrawal.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = WithdrawalRecorded.create({
   *   withdrawalId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   positionId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   fundId: EntityId.create(
   *     "323e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   date: new Date("2026-01-10T00:00:00.000Z"),
   *   amount: PositiveMoney.create("1000"),
   *   quotas: QuotaQuantity.create("80"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: WithdrawalRecordedProps,
    id?: string
  ): WithdrawalRecorded {
    if (!props.withdrawalId) {
      throw new ValidationError(
        "`WithdrawalRecorded` must have a withdrawal id."
      )
    }
    if (!props.positionId) {
      throw new ValidationError(
        "`WithdrawalRecorded` must have a position id."
      )
    }
    if (!props.fundId) {
      throw new ValidationError(
        "`WithdrawalRecorded` must have a fund id."
      )
    }
    if (!props.date) {
      throw new ValidationError(
        "`WithdrawalRecorded` must have a date."
      )
    }
    if (!props.amount) {
      throw new ValidationError(
        "`WithdrawalRecorded` must have an amount."
      )
    }
    if (!props.quotas) {
      throw new ValidationError(
        "`WithdrawalRecorded` must have quotas."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<WithdrawalRecordedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new WithdrawalRecorded(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: WithdrawalRecorded | null): boolean {
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
