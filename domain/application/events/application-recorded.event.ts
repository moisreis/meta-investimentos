import {
  EntityId,
  type PositiveMoney,
  type QuotaQuantity,
} from "@/value-objects"
import { ValidationError } from "@/errors"

export interface ApplicationRecordedProps {
  applicationId: EntityId
  positionId: EntityId
  fundId: EntityId
  date: Date
  amount: PositiveMoney
  quotas: QuotaQuantity
  occurredAt?: Date
}

/**
 * @summary
 * Records a fund application against a position.
 *
 * @remarks
 * Emitted after the **Application** entity is persisted.
 * Carries the applied amount and the acquired quotas.
 *
 * @explanation
 * Use this event to react to capital inflow into a fund
 * holding. It represents a meaningful business action
 * that downstream contexts consume for performance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class ApplicationRecorded {
  private readonly _id?: EntityId
  private readonly props: Required<ApplicationRecordedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the recorded application.
  get applicationId(): EntityId {
    return this.props.applicationId
  }

  // Returns the identifier of the target position.
  get positionId(): EntityId {
    return this.props.positionId
  }

  // Returns the identifier of the target fund.
  get fundId(): EntityId {
    return this.props.fundId
  }

  // Returns the date when the application was made.
  get date(): Date {
    return new Date(this.props.date)
  }

  // Returns the amount applied to the fund.
  get amount(): PositiveMoney {
    return this.props.amount
  }

  // Returns the quotas acquired by the application.
  get quotas(): QuotaQuantity {
    return this.props.quotas
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<ApplicationRecordedProps>,
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
   * Creates a valid **ApplicationRecorded** event.
   *
   * @remarks
   * Validates the required fields and value objects.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **Application** is stored. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the recorded application.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = ApplicationRecorded.create({
   *   applicationId: EntityId.create(
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
    props: ApplicationRecordedProps,
    id?: string
  ): ApplicationRecorded {
    if (!props.applicationId) {
      throw new ValidationError(
        "`ApplicationRecorded` must have an application id."
      )
    }
    if (!props.positionId) {
      throw new ValidationError(
        "`ApplicationRecorded` must have a position id."
      )
    }
    if (!props.fundId) {
      throw new ValidationError(
        "`ApplicationRecorded` must have a fund id."
      )
    }
    if (!props.date) {
      throw new ValidationError(
        "`ApplicationRecorded` must have a date."
      )
    }
    if (!props.amount) {
      throw new ValidationError(
        "`ApplicationRecorded` must have an amount."
      )
    }
    if (!props.quotas) {
      throw new ValidationError(
        "`ApplicationRecorded` must have quotas."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<ApplicationRecordedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new ApplicationRecorded(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: ApplicationRecorded | null): boolean {
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
