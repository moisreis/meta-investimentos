import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface PortfolioProps {
  acronym: string
  name: string
  userId: EntityId
  annualInterestRate: SignedPercentage
  minAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  targetAllocation: SignedPercentage
  version?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents an investment portfolio owned by a user.
 *
 * @remarks
 * Must have acronym, name, userId, annualInterestRate,
 * min/max/target allocation. Instances are immutable.
 *
 * @explanation
 * Core portfolio entity with allocation constraints and
 * target return. Supports allocation and rate updates.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Portfolio {
  private readonly _id?: EntityId
  private readonly props: Required<PortfolioProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the portfolio.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare portfolios.
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
   * Returns the acronym of the portfolio.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Short identifier used in lists and reports.
   *
   * @returns Acronym string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get acronym(): string {
    return this.props.acronym
  }

  /**
   * @summary
   * Returns the name of the portfolio.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Human-readable name shown in lists and reports.
   *
   * @returns Name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get name(): string {
    return this.props.name
  }

  /**
   * @summary
   * Returns the user ID of the portfolio owner.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Binds the portfolio to the owning application user.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get userId(): EntityId {
    return this.props.userId
  }

  /**
   * @summary
   * Returns the annual interest rate of the portfolio.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Target annual return used for projections.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get annualInterestRate(): SignedPercentage {
    return this.props.annualInterestRate
  }

  /**
   * @summary
   * Returns the minimum allocation of the portfolio.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Lower bound used for allocation compliance.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get minAllocation(): SignedPercentage {
    return this.props.minAllocation
  }

  /**
   * @summary
   * Returns the maximum allocation of the portfolio.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Upper bound used for allocation compliance.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get maxAllocation(): SignedPercentage {
    return this.props.maxAllocation
  }

  /**
   * @summary
   * Returns the target allocation of the portfolio.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Desired value used for allocation compliance.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get targetAllocation(): SignedPercentage {
    return this.props.targetAllocation
  }

  /**
   * @summary
   * Returns the optimistic-locking version of the portfolio.
   *
   * @remarks
   * Required number, defaults to zero.
   *
   * @explanation
   * Use to guard concurrent updates in the repository.
   *
   * @returns Current version number.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  get version(): number {
    return this.props.version
  }

  /**
   * @summary
   * Returns the creation timestamp of the portfolio.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Orders records and supports audit trails.
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
   * Returns the last update timestamp of the portfolio.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Shows when the portfolio last changed.
   *
   * @returns Last update Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get updatedAt(): Date {
    return new Date(this.props.updatedAt)
  }

  // ---------------------------------
  // CONSTRUCTION
  // ---------------------------------

  /**
   * @summary
   * Creates a Portfolio instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Portfolio.create instead.
   *
   * @param props - Required portfolio properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<PortfolioProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid Portfolio from the provided properties.
   *
   * @remarks
   * Validates all fields. Enforces non-negative rate and
   * min <= target <= max.
   *
   * @explanation
   * Factory method to construct a valid Portfolio.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the portfolio.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Portfolio.
   *
   * @example
   * const PORTFOLIO = Portfolio.create({
   *   acronym: "FIA",
   *   name: "Fundo de Investimento em Ações",
   *   userId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   *   annualInterestRate: SignedPercentage.create("10.5"),
   *   minAllocation: SignedPercentage.create("5"),
   *   maxAllocation: SignedPercentage.create("20"),
   *   targetAllocation: SignedPercentage.create("12"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: PortfolioProps, id?: string): Portfolio {
    if (!props.acronym || props.acronym.trim() === "") {
      throw new ValidationError("`Portfolio` must have an acronym.")
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("`Portfolio` must have a name.")
    }
    if (!props.userId || props.userId.trim() === "") {
      throw new ValidationError("`Portfolio` must have a user id.")
    }
    if (!props.annualInterestRate) {
      throw new ValidationError(
        "`Portfolio` must have an annual interest rate."
      )
    }
    if (!props.minAllocation) {
      throw new ValidationError("`Portfolio` must have a minimum allocation.")
    }
    if (!props.maxAllocation) {
      throw new ValidationError("`Portfolio` must have a maximum allocation.")
    }
    if (!props.targetAllocation) {
      throw new ValidationError("`Portfolio` must have a target allocation.")
    }
    if (props.annualInterestRate.isNegative) {
      throw new ValidationError(
        "`Portfolio` annual interest rate must not be negative."
      )
    }
    if (props.minAllocation.value.gt(props.targetAllocation.value)) {
      throw new ValidationError(
        "`Portfolio` minimum allocation must not exceed target allocation."
      )
    }
    if (props.targetAllocation.value.gt(props.maxAllocation.value)) {
      throw new ValidationError(
        "`Portfolio` target allocation must not exceed maximum allocation."
      )
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<PortfolioProps> = {
      ...props,
      version: props.version ?? 0,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Portfolio(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // MUTATIONS
  // ---------------------------------

  /**
   * @summary
   * Updates the allocation bounds of this portfolio.
   *
   * @remarks
   * Returns new Portfolio with updated bounds.
   * Enforces min <= target <= max.
   *
   * @explanation
   * Use to change allocation constraints.
   * Original instance unchanged.
   *
   * @param minAllocation - New minimum SignedPercentage.
   * @param targetAllocation - New target SignedPercentage.
   * @param maxAllocation - New maximum SignedPercentage.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns New allocation bounds.
   *
   * @example
   * const UPDATED = portfolio.updateAllocation(
   *   SignedPercentage.create("3"),
   *   SignedPercentage.create("10"),
   *   SignedPercentage.create("25"),
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public updateAllocation(
    minAllocation: SignedPercentage,
    targetAllocation: SignedPercentage,
    maxAllocation: SignedPercentage,
    now?: Date
  ): Portfolio {
    if (!minAllocation) {
      throw new ValidationError("`Portfolio` must have a minimum allocation.")
    }
    if (!targetAllocation) {
      throw new ValidationError("`Portfolio` must have a target allocation.")
    }
    if (!maxAllocation) {
      throw new ValidationError("`Portfolio` must have a maximum allocation.")
    }
    if (minAllocation.value.gt(targetAllocation.value)) {
      throw new ValidationError(
        "`Portfolio` minimum allocation must not exceed target allocation."
      )
    }
    if (targetAllocation.value.gt(maxAllocation.value)) {
      throw new ValidationError(
        "`Portfolio` target allocation must not exceed maximum allocation."
      )
    }

    const NOW = now ?? new Date()

    return new Portfolio(
      {
        ...this.props,
        minAllocation,
        targetAllocation,
        maxAllocation,
        updatedAt: NOW,
      },
      this._id
    )
  }

  /**
   * @summary
   * Updates the annual interest rate of this portfolio.
   *
   * @remarks
   * Returns new Portfolio with updated rate.
   * Rate must not be negative.
   *
   * @explanation
   * Use to change target return rate.
   * Original instance unchanged.
   *
   * @param annualInterestRate - New SignedPercentage rate.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns Portfolio with new rate.
   *
   * @example
   * const UPDATED = portfolio.updateAnnualInterestRate(
   *   SignedPercentage.create("12.0"),
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public updateAnnualInterestRate(
    annualInterestRate: SignedPercentage,
    now?: Date
  ): Portfolio {
    if (!annualInterestRate) {
      throw new ValidationError(
        "`Portfolio` must have an annual interest rate."
      )
    }
    if (annualInterestRate.isNegative) {
      throw new ValidationError(
        "`Portfolio` annual interest rate must not be negative."
      )
    }

    const NOW = now ?? new Date()

    return new Portfolio(
      {
        ...this.props,
        annualInterestRate,
        updatedAt: NOW,
      },
      this._id
    )
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this Portfolio with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two portfolios by their persisted identity.
   *
   * @param object - The Portfolio to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = Portfolio.create(PROPS, ID);
   * const B = Portfolio.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Portfolio | null): boolean {
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
