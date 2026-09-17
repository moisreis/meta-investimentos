import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface BenchmarkHistoryProps {
  benchmarkId: EntityId
  date: Date
  rate: SignedPercentage
  createdAt?: Date
}

/**
 * @summary
 * Represents the rate history of a benchmark on a given date.
 *
 * @remarks
 * Must have benchmarkId, date, rate. Instances immutable after creation.
 *
 * @explanation
 * Stores daily benchmark rates for spread calculations.
 * Supports rate updates.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class BenchmarkHistory {
  private readonly _id?: EntityId
  private readonly props: Required<BenchmarkHistoryProps>

  /**
   * @summary
   * Returns the unique identifier of the benchmark history.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Use for persistence and equality checks.
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
   * Returns the benchmark ID of the history.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to associate history with benchmark.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get benchmarkId(): EntityId {
    return this.props.benchmarkId
  }

  /**
   * @summary
   * Returns the date of the benchmark history.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Use for time-series queries.
   *
   * @returns History Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get date(): Date {
    return new Date(this.props.date)
  }

  /**
   * @summary
   * Returns the rate of the benchmark on the given date.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Use for spread and return calculations.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get rate(): SignedPercentage {
    return this.props.rate
  }

  /**
   * @summary
   * Returns the creation timestamp of the benchmark history.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Use for audit and ordering.
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
   * Creates a BenchmarkHistory instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use BenchmarkHistory.create instead.
   *
   * @param props - Required history properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<BenchmarkHistoryProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      date: new Date(props.date),
      createdAt: new Date(props.createdAt),
    })
  }

  /**
   * @summary
   * Creates a valid BenchmarkHistory from the provided properties.
   *
   * @remarks
   * Validates benchmarkId, date, rate. createdAt defaults to now.
   *
   * @explanation
   * Factory method to construct a valid BenchmarkHistory.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the history.
   * @param id - Optional unique identifier.
   *
   * @returns Valid BenchmarkHistory instance.
   *
   * @example
   * const HISTORY = BenchmarkHistory.create({
   *   benchmarkId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   *   date: new Date("2026-01-01T00:00:00.000Z"),
   *   rate: SignedPercentage.create("12.345"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: BenchmarkHistoryProps,
    id?: string
  ): BenchmarkHistory {
    if (!props.benchmarkId || props.benchmarkId.trim() === "") {
      throw new ValidationError("`BenchmarkHistory` must have a benchmark id.")
    }
    if (!props.date) {
      throw new ValidationError("`BenchmarkHistory` must have a date.")
    }
    if (!props.rate) {
      throw new ValidationError("`BenchmarkHistory` must have a rate.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<BenchmarkHistoryProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    }

    return new BenchmarkHistory(NORMALIZED_PROPS, id)
  }

  /**
   * @summary
   * Updates the rate of this benchmark history.
   *
   * @remarks
   * Returns new BenchmarkHistory instance with updated rate.
   *
   * @explanation
   * Use to correct benchmark rates.
   * Original instance unchanged.
   *
   * @param rate - New SignedPercentage rate.
   *
   * @returns New BenchmarkHistory instance with updated rate.
   *
   * @example
   * const UPDATED = history.updateRate(SignedPercentage.create("12.50"));
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public updateRate(rate: SignedPercentage): BenchmarkHistory {
    if (!rate) {
      throw new ValidationError("`BenchmarkHistory` must have a rate.")
    }

    return new BenchmarkHistory(
      {
        ...this.props,
        rate,
      },
      this._id
    )
  }

  /**
   * @summary
   * Compares this BenchmarkHistory with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The BenchmarkHistory to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = BenchmarkHistory.create(PROPS, ID);
   * const B = BenchmarkHistory.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: BenchmarkHistory | null): boolean {
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
