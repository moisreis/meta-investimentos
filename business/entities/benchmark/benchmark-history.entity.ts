import type SignedPercentage from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the properties required to create a {@link BenchmarkHistory}.
 *
 * The `createdAt` timestamp defaults to the current time when not provided.
 *
 * Use {@link BenchmarkHistory.create} to create a valid `BenchmarkHistory`
 * instance.
 */
interface BenchmarkHistoryProps {
  benchmarkId: string;
  date: Date;
  rate: SignedPercentage;
  createdAt?: Date;
}

/**
 * Represents the rate history of a benchmark on a given date.
 *
 * A `BenchmarkHistory`:
 * - must have a benchmark id.
 * - must have a date.
 * - must have a rate.
 *
 * `BenchmarkHistory` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const HISTORY = BenchmarkHistory.create({
 *   benchmarkId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   date: new Date('2026-01-01T00:00:00.000Z'),
 *   rate: SignedPercentage.create('12.345'),
 * })
 *
 * HISTORY.rate.value.toString()
 * // '12.35'
 * ```
 */
export class BenchmarkHistory {
  private readonly _id?: string;
  private readonly props: Required<BenchmarkHistoryProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the benchmark history.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the id of the benchmark the history belongs to.
   */
  get benchmarkId(): string {
    return this.props.benchmarkId;
  }

  /**
   * Returns the date of the benchmark history.
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * Returns the rate of the benchmark on the given date.
   */
  get rate(): SignedPercentage {
    return this.props.rate;
  }

  /**
   * Returns the creation timestamp of the benchmark history.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `BenchmarkHistory`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link BenchmarkHistory.create} and therefore
   * satisfy the benchmark history's invariants.
   */
  private constructor(props: Required<BenchmarkHistoryProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `BenchmarkHistory` from the provided properties.
   *
   * The `createdAt` timestamp defaults to the current time when
   * not provided.
   *
   * @param props - The properties required to create the benchmark history.
   * @param id - The unique identifier of the benchmark history.
   *
   * @returns A valid `BenchmarkHistory` instance.
   *
   * @throws {Error} If `props.benchmarkId` is blank.
   * @throws {Error} If `props.date` is missing.
   * @throws {Error} If `props.rate` is missing.
   */
  public static create(
    props: BenchmarkHistoryProps,
    id?: string,
  ): BenchmarkHistory {
    if (!props.benchmarkId || props.benchmarkId.trim() === "") {
      throw new Error("BenchmarkHistory must have a benchmark id.");
    }
    if (!props.date) {
      throw new Error("BenchmarkHistory must have a date.");
    }
    if (!props.rate) {
      throw new Error("BenchmarkHistory must have a rate.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<BenchmarkHistoryProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    };

    return new BenchmarkHistory(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `BenchmarkHistory` represents the same
   * benchmark history as the provided instance, based on referential
   * equality and the unique id.
   *
   * @param object - The benchmark history to compare against.
   * @returns `true` when both benchmark histories share the same id;
   * otherwise, `false`.
   */
  public equals(object?: BenchmarkHistory | null): boolean {
    if (object == null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!this._id || !object._id) {
      return false;
    }

    return this._id === object._id;
  }
}
