import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface PortfolioRegisteredProps {
  portfolioId: EntityId
  userId: EntityId
  acronym: string
  name: string
  annualInterestRate: SignedPercentage
  occurredAt?: Date
}

/**
 * @summary
 * Registers a new investment portfolio.
 *
 * @remarks
 * Emitted after the **Portfolio** entity is persisted.
 * Carries the target rate.
 *
 * @explanation
 * Use this event to react to new portfolio creation.
 * The allocation of the portfolio is not carried here: it
 * belongs to the norms attached to it, in `norms-portfolio`.
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
   * Validates the required fields. The occurred date
   * defaults to now.
   *
   * @explanation
   * Factory method to build the event after the
   * **Portfolio** is stored. Throws a
   * **ValidationError** when a required field is missing.
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
      throw new ValidationError(
        "`PortfolioRegistered` must have a user id."
      )
    }
    if (!props.acronym) {
      throw new ValidationError(
        "`PortfolioRegistered` must have an acronym."
      )
    }
    if (!props.name) {
      throw new ValidationError(
        "`PortfolioRegistered` must have a name."
      )
    }
    if (!props.annualInterestRate) {
      throw new ValidationError(
        "`PortfolioRegistered` must have an annual interest rate."
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
