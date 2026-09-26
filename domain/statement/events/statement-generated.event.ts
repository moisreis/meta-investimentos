import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface StatementGeneratedProps {
  statementId: EntityId
  periodStart: Date
  periodEnd: Date
  fileUrl: string
  portfolioId?: EntityId | null
  generatedByUserId?: EntityId | null
  occurredAt?: Date
}

/**
 * @summary
 * Generates an investment portfolio statement.
 *
 * @remarks
 * Emitted after the **Statement** entity is persisted.
 * Carries the file reference and the covered period.
 *
 * @explanation
 * Use this event to react to statement generation.
 * It notifies downstream contexts that a new
 * portfolio statement is available for download.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class StatementGenerated {
  private readonly _id?: EntityId
  private readonly props: Required<StatementGeneratedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the generated statement.
  get statementId(): EntityId {
    return this.props.statementId
  }

  // Returns the start date of the covered period.
  get periodStart(): Date {
    return new Date(this.props.periodStart)
  }

  // Returns the end date of the covered period.
  get periodEnd(): Date {
    return new Date(this.props.periodEnd)
  }

  // Returns the file url of the generated statement.
  get fileUrl(): string {
    return this.props.fileUrl
  }

  // Returns the related portfolio, if any.
  get portfolioId(): EntityId | null {
    return this.props.portfolioId
  }

  // Returns the user who generated the statement.
  get generatedByUserId(): EntityId | null {
    return this.props.generatedByUserId
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<StatementGeneratedProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      periodStart: new Date(props.periodStart),
      periodEnd: new Date(props.periodEnd),
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **StatementGenerated** event.
   *
   * @remarks
   * Validates the required fields and the period order.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **Statement** is stored. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the generated statement.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = StatementGenerated.create({
   *   statementId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   periodStart: new Date("2026-01-01T00:00:00.000Z"),
   *   periodEnd: new Date("2026-01-31T00:00:00.000Z"),
   *   fileUrl: "https://example.com/statements/january.pdf",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: StatementGeneratedProps,
    id?: string
  ): StatementGenerated {
    if (!props.statementId) {
      throw new ValidationError(
        "`StatementGenerated` must have a statement id."
      )
    }
    if (!props.periodStart) {
      throw new ValidationError(
        "`StatementGenerated` must have a period start."
      )
    }
    if (!props.periodEnd) {
      throw new ValidationError(
        "`StatementGenerated` must have a period end."
      )
    }
    if (!props.fileUrl || props.fileUrl.trim() === "") {
      throw new ValidationError(
        "`StatementGenerated` must have a file url."
      )
    }
    if (
      props.periodStart.getTime() > props.periodEnd.getTime()
    ) {
      throw new ValidationError(
        "`StatementGenerated` must have an ordered period."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<StatementGeneratedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      portfolioId: props.portfolioId ?? null,
      generatedByUserId: props.generatedByUserId ?? null,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new StatementGenerated(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: StatementGenerated | null): boolean {
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
