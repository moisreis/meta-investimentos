import { EntityId } from "@/value-objects";
import { ValidationError } from "@/errors";

interface BenchmarkProps {
  acronym: string;
  name: string;
  createdAt?: Date;
}

/**
 * @summary
 * Represents an investment benchmark.
 *
 * @remarks
 * Must have acronym and name.
 * Instances immutable after creation.
 *
 * @explanation
 * Stores benchmark for performance comparison.
 * Supports renaming and acronym changes.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Benchmark {
  private readonly _id?: EntityId;
  private readonly props: Required<BenchmarkProps>;

  /**
   * @summary
   * Returns the unique identifier of the benchmark.
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
    return this._id;
  }

  /**
   * @summary
   * Returns the acronym of the benchmark.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Use for short identification.
   *
   * @returns Acronym string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get acronym(): string {
    return this.props.acronym;
  }

  /**
   * @summary
   * Returns the name of the benchmark.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Use for display and identification.
   *
   * @returns Name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * @summary
   * Returns the creation timestamp of the benchmark.
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
    return this.props.createdAt;
  }

  /**
   * @summary
   * Creates a Benchmark instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Benchmark.create instead.
   *
   * @param props - Required benchmark properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<BenchmarkProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * @summary
   * Creates a valid Benchmark from the provided properties.
   *
   * @remarks
   * Validates acronym and name. createdAt defaults to current time.
   *
   * @explanation
   * Factory method to construct a valid Benchmark.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the benchmark.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Benchmark instance.
   *
   * @example
   * const BENCHMARK = Benchmark.create({
   *   acronym: "IBOV",
   *   name: "Ibovespa",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
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
   * @summary
   * Renames this benchmark.
   *
   * @remarks
   * Returns new Benchmark instance with updated name.
   *
   * @explanation
   * Use to change benchmark name.
   * Original instance unchanged.
   *
   * @param name - New benchmark name.
   *
   * @returns New Benchmark instance with updated name.
   *
   * @example
   * const RENAMED = benchmark.rename("Ibovespa Total Return");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
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
   * @summary
   * Changes the acronym of this benchmark.
   *
   * @remarks
   * Returns new Benchmark instance with updated acronym.
   *
   * @explanation
   * Use to change benchmark acronym.
   * Original instance unchanged.
   *
   * @param acronym - New benchmark acronym.
   *
   * @returns New Benchmark instance with updated acronym.
   *
   * @example
   * const RECODED = benchmark.changeAcronym("IBX");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
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
   * @summary
   * Compares this Benchmark with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The Benchmark to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = Benchmark.create(PROPS, ID);
   * const B = Benchmark.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
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
