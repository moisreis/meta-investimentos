import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link Benchmark}.
 *
 * The `createdAt` timestamp defaults to the current time when not provided.
 *
 * Use {@link Benchmark.create} to create a valid `Benchmark` instance.
 */
interface BenchmarkProps {
  acronym: string;
  name: string;
  createdAt?: Date;
}

/**
 * Represents an investment benchmark.
 *
 * A `Benchmark` must have an acronym and a name.
 *
 * `Benchmark` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const BENCHMARK = Benchmark.create({
 *   acronym: 'IBOV',
 *   name: 'Ibovespa',
 * })
 *
 * BENCHMARK.acronym
 * // 'IBOV'
 * ```
 */
export class Benchmark {
  private readonly _id?: EntityId;
  private readonly props: Required<BenchmarkProps>;

  /**
   * Returns the unique identifier of the benchmark.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the acronym of the benchmark.
   */
  get acronym(): string {
    return this.props.acronym;
  }

  /**
   * Returns the name of the benchmark.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Returns the creation timestamp of the benchmark.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Creates a `Benchmark`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Benchmark.create} and therefore satisfy
   * the benchmark's invariants.
   */
  private constructor(props: Required<BenchmarkProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `Benchmark` from the provided properties.
   *
   * The `createdAt` timestamp defaults to the current time when
   * not provided.
   *
   * @param props - The properties required to create the benchmark.
   * @param id - The unique identifier of the benchmark.
   *
   * @returns A valid `Benchmark` instance.
   *
   * @throws {ValidationError} If `props.acronym` is blank.
   * @throws {ValidationError} If `props.name` is blank.
   */
  public static create(props: BenchmarkProps, id?: string): Benchmark {
    if (!props.acronym || props.acronym.trim() === "") {
      throw new ValidationError("Benchmark must have an acronym.");
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("Benchmark must have a name.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<BenchmarkProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    };

    return new Benchmark(NORMALIZED_PROPS, id);
  }

  /**
   * Renames this benchmark.
   *
   * The code returns a new `Benchmark` instance with the updated name,
   * leaving the original instance unchanged.
   *
   * @param name - The new name of the benchmark.
   *
   * @returns A new `Benchmark` instance with the updated name.
   *
   * @throws {ValidationError} If `name` is blank.
   */
  public rename(name: string): Benchmark {
    if (!name || name.trim() === "") {
      throw new ValidationError("Benchmark must have a name.");
    }

    return new Benchmark(
      {
        ...this.props,
        name,
      },
      this._id,
    );
  }

  /**
   * Changes the acronym of this benchmark.
   *
   * The code returns a new `Benchmark` instance with the updated acronym,
   * leaving the original instance unchanged.
   *
   * @param acronym - The new acronym of the benchmark.
   *
   * @returns A new `Benchmark` instance with the updated acronym.
   *
   * @throws {ValidationError} If `acronym` is blank.
   */
  public changeAcronym(acronym: string): Benchmark {
    if (!acronym || acronym.trim() === "") {
      throw new ValidationError("Benchmark must have an acronym.");
    }

    return new Benchmark(
      {
        ...this.props,
        acronym,
      },
      this._id,
    );
  }

  /**
   * Determines whether this `Benchmark` represents the same benchmark
   * as the provided instance, based on referential equality and the
   * unique id.
   *
   * @param object - The benchmark to compare against.
   * @returns `true` when both benchmarks share the same id; otherwise, `false`.
   */
  public equals(object?: Benchmark | null): boolean {
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
