import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface PortfolioProps {
  acronym: string
  name: string
  userId: EntityId
  annualInterestRate: SignedPercentage
  version?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents an investment portfolio owned by a user.
 *
 * @remarks
 * Must have acronym, name, userId and annualInterestRate.
 * Instances are immutable. The allocation of the portfolio is
 * not held here: it belongs to the norms attached to it, in
 * `norms-portfolio`.
 *
 * @explanation
 * Core portfolio entity with the target return. Supports
 * rate, acronym and name updates.
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
  private constructor(
    props: Required<PortfolioProps>,
    id?: string
  ) {
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
   * Validates all fields. Enforces non-negative rate.
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
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: PortfolioProps,
    id?: string
  ): Portfolio {
    if (!props.acronym || props.acronym.trim() === "") {
      throw new ValidationError(
        "`Portfolio` must have an acronym."
      )
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("`Portfolio` must have a name.")
    }
    if (!props.userId || props.userId.trim() === "") {
      throw new ValidationError(
        "`Portfolio` must have a user id."
      )
    }
    if (!props.annualInterestRate) {
      throw new ValidationError(
        "`Portfolio` must have an annual interest rate."
      )
    }
    if (props.annualInterestRate.isNegative) {
      throw new ValidationError(
        "`Portfolio` annual interest rate must not be negative."
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

  /**
   * @summary
   * Updates the acronym of this portfolio.
   *
   * @remarks
   * Returns new Portfolio with updated acronym.
   * Acronym must not be blank.
   *
   * @explanation
   * Use to change the portfolio acronym.
   * Original instance unchanged.
   *
   * @param acronym - New acronym string.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns Portfolio with new acronym.
   *
   * @example
   * const UPDATED = portfolio.updateAcronym("IPCA+");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-22
   */
  public updateAcronym(acronym: string, now?: Date): Portfolio {
    if (!acronym || acronym.trim() === "") {
      throw new ValidationError(
        "`Portfolio` must have an acronym."
      )
    }

    const NOW = now ?? new Date()

    return new Portfolio(
      {
        ...this.props,
        acronym,
        updatedAt: NOW,
      },
      this._id
    )
  }

  /**
   * @summary
   * Updates the name of this portfolio.
   *
   * @remarks
   * Returns new Portfolio with updated name.
   * Name must not be blank.
   *
   * @explanation
   * Use to change the portfolio display name.
   * Original instance unchanged.
   *
   * @param name - New name string.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns Portfolio with new name.
   *
   * @example
   * const UPDATED = portfolio.updateName("Renda Fixa IPCA");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-22
   */
  public updateName(name: string, now?: Date): Portfolio {
    if (!name || name.trim() === "") {
      throw new ValidationError("`Portfolio` must have a name.")
    }

    const NOW = now ?? new Date()

    return new Portfolio(
      {
        ...this.props,
        name,
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
