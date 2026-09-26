import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface PositionOpenedProps {
  positionId: EntityId
  portfolioId: EntityId
  fundId: EntityId
  occurredAt?: Date
}

/**
 * @summary
 * Opens a fund position within a portfolio.
 *
 * @remarks
 * Emitted after the **Position** entity is persisted.
 * Carries the portfolio and fund references.
 *
 * @explanation
 * Use this event to react to a new fund holding.
 * It links a portfolio to a fund for tracking
 * applications, withdrawals, and performance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class PositionOpened {
  private readonly _id?: EntityId
  private readonly props: Required<PositionOpenedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the opened position.
  get positionId(): EntityId {
    return this.props.positionId
  }

  // Returns the identifier of the parent portfolio.
  get portfolioId(): EntityId {
    return this.props.portfolioId
  }

  // Returns the identifier of the held fund.
  get fundId(): EntityId {
    return this.props.fundId
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<PositionOpenedProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **PositionOpened** event.
   *
   * @remarks
   * Validates the required fields and value objects.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **Position** is stored. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the opened position.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = PositionOpened.create({
   *   positionId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   portfolioId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   fundId: EntityId.create(
   *     "323e4567-e89b-42d3-a456-426614174000"
   *   ),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: PositionOpenedProps,
    id?: string
  ): PositionOpened {
    if (!props.positionId) {
      throw new ValidationError(
        "`PositionOpened` must have a position id."
      )
    }
    if (!props.portfolioId) {
      throw new ValidationError(
        "`PositionOpened` must have a portfolio id."
      )
    }
    if (!props.fundId) {
      throw new ValidationError(
        "`PositionOpened` must have a fund id."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<PositionOpenedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new PositionOpened(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: PositionOpened | null): boolean {
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
