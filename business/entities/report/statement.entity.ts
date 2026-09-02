/**
 * Represents the properties required to create a {@link Statement}.
 *
 * The `portfolioId` and `generatedByUserId` default to `null`, and
 * the `createdAt` timestamp defaults to the current time when not
 * provided.
 *
 * Use {@link Statement.create} to create a valid `Statement` instance.
 */
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

interface StatementProps {
  portfolioId?: EntityId | null;
  periodStart: Date;
  periodEnd: Date;
  fileUrl: string;
  generatedByUserId?: EntityId | null;
  createdAt?: Date;
}

/**
 * Represents an investment portfolio statement.
 *
 * A `Statement`:
 * - must have a period start.
 * - must have a period end.
 * - must have a file url.
 *
 * `Statement` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const STATEMENT = Statement.create({
 *   periodStart: new Date('2026-01-01'),
 *   periodEnd: new Date('2026-01-31'),
 *   fileUrl: 'https://example.com/statements/january.pdf',
 * })
 *
 * STATEMENT.periodStart
 * // new Date('2026-01-01')
 * ```
 */
export class Statement {
  private readonly _id?: EntityId;
  private readonly props: Required<StatementProps>;

  /**
   * Returns the unique identifier of the statement.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the id of the portfolio the statement belongs to.
   */
  get portfolioId(): EntityId | null {
    return this.props.portfolioId;
  }

  /**
   * Returns the start date of the statement period.
   */
  get periodStart(): Date {
    return this.props.periodStart;
  }

  /**
   * Returns the end date of the statement period.
   */
  get periodEnd(): Date {
    return this.props.periodEnd;
  }

  /**
   * Returns the file url of the statement.
   */
  get fileUrl(): string {
    return this.props.fileUrl;
  }

  /**
   * Returns the id of the user who generated the statement.
   */
  get generatedByUserId(): EntityId | null {
    return this.props.generatedByUserId;
  }

  /**
   * Returns the creation timestamp of the statement.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Creates a `Statement`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Statement.create} and therefore satisfy
   * the statement's invariants.
   */
  private constructor(props: Required<StatementProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `Statement` from the provided properties.
   *
   * The `portfolioId` and `generatedByUserId` default to `null`, and
   * the `createdAt` timestamp to the current time when those
   * properties are not provided.
   *
   * @param props - The properties required to create the statement.
   * @param id - The unique identifier of the statement.
   *
   * @returns A valid `Statement` instance.
   *
   * @throws {ValidationError} If `props.periodStart` is missing.
   * @throws {ValidationError} If `props.periodEnd` is missing.
   * @throws {ValidationError} If `props.fileUrl` is blank.
   * @throws {ValidationError} If `props.periodStart` is after `props.periodEnd`.
   */
  public static create(props: StatementProps, id?: string): Statement {
    if (!props.periodStart) {
      throw new ValidationError("Statement must have a period start.");
    }
    if (!props.periodEnd) {
      throw new ValidationError("Statement must have a period end.");
    }
    if (!props.fileUrl || props.fileUrl.trim() === "") {
      throw new ValidationError("Statement must have a file url.");
    }
    if (props.periodStart.getTime() > props.periodEnd.getTime()) {
      throw new ValidationError(
        "Statement period start must not be after period end.",
      );
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<StatementProps> = {
      ...props,
      portfolioId: props.portfolioId ?? null,
      generatedByUserId: props.generatedByUserId ?? null,
      createdAt: props.createdAt ?? NOW,
    };

    return new Statement(NORMALIZED_PROPS, id);
  }

  /**
   * Determines whether this `Statement` represents the same statement
   * as the provided instance, based on referential equality and the
   * unique id.
   *
   * @param object - The statement to compare against.
   * @returns `true` when both statements share the same id; otherwise, `false`.
   */
  public equals(object?: Statement | null): boolean {
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
