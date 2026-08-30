/**
 * Represents the properties required to create a {@link Statement}.
 *
 * The `portfolioId` and `generatedByUserId` default to `null`, and
 * the `createdAt` timestamp defaults to the current time when not
 * provided.
 *
 * Use {@link Statement.create} to create a valid `Statement` instance.
 */
interface StatementProps {
  portfolioId?: string | null;
  periodStart: Date;
  periodEnd: Date;
  fileUrl: string;
  generatedByUserId?: string | null;
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
  private readonly _id?: string;
  private readonly props: Required<StatementProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the statement.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the id of the portfolio the statement belongs to.
   */
  get portfolioId(): string | null {
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
  get generatedByUserId(): string | null {
    return this.props.generatedByUserId;
  }

  /**
   * Returns the creation timestamp of the statement.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `Statement`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Statement.create} and therefore satisfy
   * the statement's invariants.
   */
  private constructor(props: Required<StatementProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

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
   * @throws {Error} If `props.periodStart` is missing.
   * @throws {Error} If `props.periodEnd` is missing.
   * @throws {Error} If `props.fileUrl` is blank.
   */
  public static create(props: StatementProps, id?: string): Statement {
    if (!props.periodStart) {
      throw new Error("Statement must have a period start.");
    }
    if (!props.periodEnd) {
      throw new Error("Statement must have a period end.");
    }
    if (!props.fileUrl || props.fileUrl.trim() === "") {
      throw new Error("Statement must have a file url.");
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

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

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
