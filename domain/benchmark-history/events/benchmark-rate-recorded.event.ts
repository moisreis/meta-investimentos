import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface BenchmarkRateRecordedProps {
  historyId: EntityId
  benchmarkId: EntityId
  date: Date
  rate: SignedPercentage
  occurredAt?: Date
}

/**
 * @summary
 * Records a benchmark rate on a given date.
 *
 * @remarks
 * Emitted after the **BenchmarkHistory** is persisted.
 * Carries the rate applied to the benchmark.
 *
 * @explanation
 * Use this event to react to benchmark rate updates.
 * It feeds spread and return calculations across
 * downstream contexts.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class BenchmarkRateRecorded {
  private readonly _id?: EntityId
  private readonly props: Required<BenchmarkRateRecordedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the recorded history.
  get historyId(): EntityId {
    return this.props.historyId
  }

  // Returns the identifier of the target benchmark.
  get benchmarkId(): EntityId {
    return this.props.benchmarkId
  }

  // Returns the date when the rate was recorded.
  get date(): Date {
    return new Date(this.props.date)
  }

  // Returns the recorded benchmark rate.
  get rate(): SignedPercentage {
    return this.props.rate
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<BenchmarkRateRecordedProps>,
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
   * Creates a valid **BenchmarkRateRecorded** event.
   *
   * @remarks
   * Validates the required fields and value objects.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **BenchmarkHistory** is stored. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the recorded benchmark rate.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = BenchmarkRateRecorded.create({
   *   historyId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   benchmarkId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   date: new Date("2026-01-10T00:00:00.000Z"),
   *   rate: SignedPercentage.create("12.345"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: BenchmarkRateRecordedProps,
    id?: string
  ): BenchmarkRateRecorded {
    if (!props.historyId) {
      throw new ValidationError(
        "`BenchmarkRateRecorded` must have a history id."
      )
    }
    if (!props.benchmarkId) {
      throw new ValidationError(
        "`BenchmarkRateRecorded` must have a benchmark id."
      )
    }
    if (!props.date) {
      throw new ValidationError("`BenchmarkRateRecorded` must have a date.")
    }
    if (!props.rate) {
      throw new ValidationError("`BenchmarkRateRecorded` must have a rate.")
    }

    const NOW = new Date()

    type RequiredProps = Required<BenchmarkRateRecordedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new BenchmarkRateRecorded(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(
    object?: BenchmarkRateRecorded | null
  ): boolean {
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