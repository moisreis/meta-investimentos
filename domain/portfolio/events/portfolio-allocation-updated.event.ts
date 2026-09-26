import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface PortfolioAllocationUpdatedProps {
  portfolioId: EntityId
  minAllocation?: SignedPercentage | undefined
  targetAllocation?: SignedPercentage | undefined
  maxAllocation?: SignedPercentage | undefined
  annualInterestRate?: SignedPercentage | undefined
  occurredAt?: Date
}

type RequiredProps = {
  portfolioId: EntityId
  minAllocation: SignedPercentage | undefined
  targetAllocation: SignedPercentage | undefined
  maxAllocation: SignedPercentage | undefined
  annualInterestRate: SignedPercentage | undefined
  occurredAt: Date
}

/**
 * @summary
 * Updates the allocation bounds of a portfolio.
 *
 * @remarks
 * Emitted after the **Portfolio** allocation is changed.
 * Carries only the fields that were updated.
 *
 * @explanation
 * Use this event to react to allocation adjustments.
 * Optional fields identify which bounds were changed
 * and the new annual interest rate.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class PortfolioAllocationUpdated {
  private readonly _id?: EntityId
  private readonly props: RequiredProps

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the updated portfolio.
  get portfolioId(): EntityId {
    return this.props.portfolioId
  }

  // Returns the new minimum allocation, if changed.
  get minAllocation(): SignedPercentage | undefined {
    return this.props.minAllocation
  }

  // Returns the new target allocation, if changed.
  get targetAllocation(): SignedPercentage | undefined {
    return this.props.targetAllocation
  }

  // Returns the new maximum allocation, if changed.
  get maxAllocation(): SignedPercentage | undefined {
    return this.props.maxAllocation
  }

  // Returns the new annual interest rate, if changed.
  get annualInterestRate(): SignedPercentage | undefined {
    return this.props.annualInterestRate
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(props: RequiredProps, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **PortfolioAllocationUpdated** event.
   *
   * @remarks
   * Validates the portfolio identifier. Optional fields
   * default to undefined when not provided.
   *
   * @explanation
   * Factory method to build the event after the
   * **Portfolio** allocation is changed. Throws a
   * **ValidationError** when the portfolio id is missing.
   *
   * @param props - Properties of the updated allocation.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = PortfolioAllocationUpdated.create({
   *   portfolioId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   minAllocation: SignedPercentage.create("5"),
   *   targetAllocation: SignedPercentage.create("12"),
   *   maxAllocation: SignedPercentage.create("20"),
   *   annualInterestRate: SignedPercentage.create("10.5"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: PortfolioAllocationUpdatedProps,
    id?: string
  ): PortfolioAllocationUpdated {
    if (!props.portfolioId) {
      throw new ValidationError(
        "`PortfolioAllocationUpdated` needs a portfolio id."
      )
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      minAllocation: props.minAllocation,
      targetAllocation: props.targetAllocation,
      maxAllocation: props.maxAllocation,
      annualInterestRate: props.annualInterestRate,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new PortfolioAllocationUpdated(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(
    object?: PortfolioAllocationUpdated | null
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
