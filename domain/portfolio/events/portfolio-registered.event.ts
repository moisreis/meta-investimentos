import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface PortfolioRegisteredProps {
  portfolioId: EntityId
  userId: EntityId
  acronym: string
  name: string
  annualInterestRate: SignedPercentage
  minAllocation: SignedPercentage
  targetAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  occurredAt?: Date
}

/**
 * @summary
 * Registers a new investment portfolio.
 *
 * @remarks
 * Emitted after the **Portfolio** entity is persisted.
 * Carries the allocation bounds and the target rate.
 *
 * @explanation
 * Use this event to react to new portfolio creation.
 * It exposes the allocation constraints consumed by
 * downstream contexts for compliance and returns.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class PortfolioRegistered {
  private readonly _id?: EntityId
  private readonly props: Required<PortfolioRegisteredProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the registered portfolio.
  get portfolioId(): EntityId {
    return this.props.portfolioId
  }

  // Returns the identifier of the portfolio owner.
  get userId(): EntityId {
    return this.props.userId
  }

  // Returns the acronym of the registered portfolio.
  get acronym(): string {
    return this.props.acronym
  }

  // Returns the name of the registered portfolio.
  get name(): string {
    return this.props.name
  }

  // Returns the annual interest rate of the portfolio.
  get annualInterestRate(): SignedPercentage {
    return this.props.annualInterestRate
  }

  // Returns the minimum allocation of the portfolio.
  get minAllocation(): SignedPercentage {
    return this.props.minAllocation
  }

  // Returns the target allocation of the portfolio.
  get targetAllocation(): SignedPercentage {
    return this.props.targetAllocation
  }

  // Returns the maximum allocation of the portfolio.
  get maxAllocation(): SignedPercentage {
    return this.props.maxAllocation
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<PortfolioRegisteredProps>,
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
   * Creates a valid **PortfolioRegistered** event.
   *
   * @remarks
   * Validates the required fields and the allocation
   * bounds. The occurred date defaults to now.
   *
   * @explanation
   * Factory method to build the event after the
   * **Portfolio** is stored. Throws a
   * **ValidationError** when a required field is missing
   * or the allocation bounds are not ordered.
   *
   * @param props - Properties of the registered portfolio.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = PortfolioRegistered.create({
   *   portfolioId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   userId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   acronym: "FIA",
   *   name: "Fundo de Investimento em Ações",
   *   annualInterestRate: SignedPercentage.create("10.5"),
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
    props: PortfolioRegisteredProps,
    id?: string
  ): PortfolioRegistered {
    if (!props.portfolioId) {
      throw new ValidationError(
        "`PortfolioRegistered` must have a portfolio id."
      )
    }
    if (!props.userId) {
      throw new ValidationError("`PortfolioRegistered` must have a user id.")
    }
    if (!props.acronym) {
      throw new ValidationError("`PortfolioRegistered` must have an acronym.")
    }
    if (!props.name) {
      throw new ValidationError("`PortfolioRegistered` must have a name.")
    }
    if (!props.annualInterestRate) {
      throw new ValidationError(
        "`PortfolioRegistered` must have an annual interest rate."
      )
    }
    if (!props.minAllocation) {
      throw new ValidationError(
        "`PortfolioRegistered` must have a minimum allocation."
      )
    }
    if (!props.targetAllocation) {
      throw new ValidationError(
        "`PortfolioRegistered` must have a target allocation."
      )
    }
    if (!props.maxAllocation) {
      throw new ValidationError(
        "`PortfolioRegistered` must have a maximum allocation."
      )
    }

    const MIN = props.minAllocation.value
    const TARGET = props.targetAllocation.value
    const MAX = props.maxAllocation.value

    if (MIN.gt(TARGET)) {
      throw new ValidationError(
        "`PortfolioRegistered` min is above target."
      )
    }
    if (TARGET.gt(MAX)) {
      throw new ValidationError(
        "`PortfolioRegistered` target is above max."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<PortfolioRegisteredProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new PortfolioRegistered(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: PortfolioRegistered | null): boolean {
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