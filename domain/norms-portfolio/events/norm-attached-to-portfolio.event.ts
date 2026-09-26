import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface NormAttachedToPortfolioProps {
  normId: EntityId
  portfolioId: EntityId
  minAllocation: SignedPercentage
  targetAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  occurredAt?: Date
}

/**
 * @summary
 * Attaches a norm to a portfolio with limits.
 *
 * @remarks
 * Emitted after the **NormsPortfolios** relation is persisted.
 * Carries the allocation limits of the attachment.
 *
 * @explanation
 * Use this event to react to norm enforcement setup.
 * It links a regulatory norm to a portfolio with
 * specific allocation constraints.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class NormAttachedToPortfolio {
  private readonly _id?: EntityId
  private readonly props: Required<NormAttachedToPortfolioProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the attached norm.
  get normId(): EntityId {
    return this.props.normId
  }

  // Returns the identifier of the target portfolio.
  get portfolioId(): EntityId {
    return this.props.portfolioId
  }

  // Returns the minimum allocation of the attachment.
  get minAllocation(): SignedPercentage {
    return this.props.minAllocation
  }

  // Returns the target allocation of the attachment.
  get targetAllocation(): SignedPercentage {
    return this.props.targetAllocation
  }

  // Returns the maximum allocation of the attachment.
  get maxAllocation(): SignedPercentage {
    return this.props.maxAllocation
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<NormAttachedToPortfolioProps>,
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
   * Creates a valid **NormAttachedToPortfolio** event.
   *
   * @remarks
   * Validates the required fields and the allocation
   * bounds. The occurred date defaults to now.
   *
   * @explanation
   * Factory method to build the event after the
   * **NormsPortfolios** relation is stored. Throws a
   * **ValidationError** when a required field is missing
   * or the allocation bounds are not ordered.
   *
   * @param props - Properties of the attached norm.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = NormAttachedToPortfolio.create({
   *   normId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   portfolioId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   minAllocation: SignedPercentage.create("5"),
   *   targetAllocation: SignedPercentage.create("12"),
   *   maxAllocation: SignedPercentage.create("20"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: NormAttachedToPortfolioProps,
    id?: string
  ): NormAttachedToPortfolio {
    if (!props.normId) {
      throw new ValidationError(
        "`NormAttachedToPortfolio` must have a norm id."
      )
    }
    if (!props.portfolioId) {
      throw new ValidationError(
        "`NormAttachedToPortfolio` must have a portfolio id."
      )
    }
    if (!props.minAllocation) {
      throw new ValidationError(
        "`NormAttachedToPortfolio` must have a minimum allocation."
      )
    }
    if (!props.targetAllocation) {
      throw new ValidationError(
        "`NormAttachedToPortfolio` must have a target allocation."
      )
    }
    if (!props.maxAllocation) {
      throw new ValidationError(
        "`NormAttachedToPortfolio` must have a maximum allocation."
      )
    }

    const MIN = props.minAllocation.value
    const TARGET = props.targetAllocation.value
    const MAX = props.maxAllocation.value

    if (MIN.gt(TARGET)) {
      throw new ValidationError(
        "`NormAttachedToPortfolio` min is above target."
      )
    }
    if (TARGET.gt(MAX)) {
      throw new ValidationError(
        "`NormAttachedToPortfolio` target is above max."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<NormAttachedToPortfolioProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new NormAttachedToPortfolio(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(
    object?: NormAttachedToPortfolio | null
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
