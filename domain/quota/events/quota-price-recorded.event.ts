import { EntityId, type QuotaPrice } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface QuotaPriceRecordedProps {
  quotaId: EntityId
  fundId: EntityId
  date: Date
  price: QuotaPrice
  occurredAt?: Date
}

/**
 * @summary
 * Records a quota price for a fund on a date.
 *
 * @remarks
 * Emitted after the **QuotaPrice** is persisted.
 * Carries the price applied on a given trading day.
 *
 * @explanation
 * Use this event to react to new quota price marks.
 * Downstream contexts consume it for valuation and
 * performance calculations.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class QuotaPriceRecorded {
  private readonly _id?: EntityId
  private readonly props: Required<QuotaPriceRecordedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the recorded quota price.
  get quotaId(): EntityId {
    return this.props.quotaId
  }

  // Returns the identifier of the target fund.
  get fundId(): EntityId {
    return this.props.fundId
  }

  // Returns the date when the price was recorded.
  get date(): Date {
    return new Date(this.props.date)
  }

  // Returns the recorded quota price.
  get price(): QuotaPrice {
    return this.props.price
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<QuotaPriceRecordedProps>,
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
   * Creates a valid **QuotaPriceRecorded** event.
   *
   * @remarks
   * Validates the required fields and value objects.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **QuotaPrice** is stored. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the recorded quota price.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = QuotaPriceRecorded.create({
   *   quotaId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   fundId: EntityId.create(
   *     "323e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   date: new Date("2026-01-10T00:00:00.000Z"),
   *   price: QuotaPrice.create("4.50"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: QuotaPriceRecordedProps,
    id?: string
  ): QuotaPriceRecorded {
    if (!props.quotaId) {
      throw new ValidationError(
        "`QuotaPriceRecorded` must have a quota id."
      )
    }
    if (!props.fundId) {
      throw new ValidationError(
        "`QuotaPriceRecorded` must have a fund id."
      )
    }
    if (!props.date) {
      throw new ValidationError(
        "`QuotaPriceRecorded` must have a date."
      )
    }
    if (!props.price) {
      throw new ValidationError(
        "`QuotaPriceRecorded` must have a price."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<QuotaPriceRecordedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new QuotaPriceRecorded(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: QuotaPriceRecorded | null): boolean {
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
