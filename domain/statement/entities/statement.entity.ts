import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface StatementProps {
  portfolioId?: EntityId | null
  periodStart: Date
  periodEnd: Date
  fileUrl: string
  generatedByUserId?: EntityId | null
  createdAt?: Date
}

/**
 * @summary
 * Represents an investment portfolio statement.
 *
 * @remarks
 * Must have periodStart, periodEnd, fileUrl.
 * Instances are immutable after creation.
 *
 * @explanation
 * Stores generated portfolio statements with file references.
 * Validates period order.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Statement {
  private readonly _id?: EntityId
  private readonly props: Required<StatementProps>

  /**
   * @summary
   * Returns the unique identifier of the statement.
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
   * Returns the portfolio ID of the statement.
   *
   * @remarks
   * Nullable EntityId.
   *
   * @explanation
   * Use to associate statement with portfolio.
   *
   * @returns EntityId or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get portfolioId(): EntityId | null {
    return this.props.portfolioId
  }

  /**
   * @summary
   * Returns the start date of the statement period.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Use for period filtering.
   *
   * @returns Period start Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get periodStart(): Date {
    return new Date(this.props.periodStart)
  }

  /**
   * @summary
   * Returns the end date of the statement period.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Use for period filtering.
   *
   * @returns Period end Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get periodEnd(): Date {
    return new Date(this.props.periodEnd)
  }

  /**
   * @summary
   * Returns the file URL of the statement.
   *
   * @remarks
   * Required string URL.
   *
   * @explanation
   * Use to download or view statement.
   *
   * @returns File URL string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get fileUrl(): string {
    return this.props.fileUrl
  }

  /**
   * @summary
   * Returns the ID of the user who generated the statement.
   *
   * @remarks
   * Nullable EntityId.
   *
   * @explanation
   * Use for audit trail.
   *
   * @returns EntityId or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get generatedByUserId(): EntityId | null {
    return this.props.generatedByUserId
  }

  /**
   * @summary
   * Returns the creation timestamp of the statement.
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
   * Creates a Statement instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Statement.create instead.
   *
   * @param props - Required statement properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<StatementProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      periodStart: new Date(props.periodStart),
      periodEnd: new Date(props.periodEnd),
      createdAt: new Date(props.createdAt),
    })
  }

  /**
   * @summary
   * Creates a valid Statement from the provided properties.
   *
   * @remarks
   * Validates periodStart, periodEnd, fileUrl, and period order.
   * Defaults for optional fields.
   *
   * @explanation
   * Factory method to construct a valid Statement.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the statement.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Statement instance.
   *
   * @example
   * const STATEMENT = Statement.create({
   *   periodStart: new Date("2026-01-01"),
   *   periodEnd: new Date("2026-01-31"),
   *   fileUrl: "https://example.com/statements/january.pdf",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: StatementProps, id?: string): Statement {
    if (!props.periodStart) {
      throw new ValidationError("`Statement` must have a period start.")
    }
    if (!props.periodEnd) {
      throw new ValidationError("`Statement` must have a period end.")
    }
    if (!props.fileUrl || props.fileUrl.trim() === "") {
      throw new ValidationError("`Statement` must have a file url.")
    }
    if (props.periodStart.getTime() > props.periodEnd.getTime()) {
      throw new ValidationError(
        "`Statement` period start must not be after period end."
      )
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<StatementProps> = {
      ...props,
      portfolioId: props.portfolioId ?? null,
      generatedByUserId: props.generatedByUserId ?? null,
      createdAt: props.createdAt ?? NOW,
    }

    return new Statement(NORMALIZED_PROPS, id)
  }

  /**
   * @summary
   * Compares this Statement with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two Statement instances represent same entity.
   *
   * @param object - The Statement to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = Statement.create(PROPS, ID);
   * const B = Statement.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Statement | null): boolean {
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
