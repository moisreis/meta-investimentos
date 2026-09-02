import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link Portfolio}.
 *
 * The timestamps default to the current time when not provided.
 *
 * Use {@link Portfolio.create} to create a valid `Portfolio` instance.
 */
interface PortfolioProps {
  acronym: string;
  name: string;
  userId: EntityId;
  annualInterestRate: SignedPercentage;
  minAllocation: SignedPercentage;
  maxAllocation: SignedPercentage;
  targetAllocation: SignedPercentage;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents an investment portfolio owned by a user.
 *
 * A `Portfolio`:
 * - must have an acronym.
 * - must have a name.
 * - must have a user id.
 * - must have an annual interest rate.
 * - must have a minimum allocation.
 * - must have a maximum allocation.
 * - must have a target allocation.
 *
 * `Portfolio` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const PORTFOLIO = Portfolio.create({
 *   acronym: 'FIA',
 *   name: 'Fundo de Investimento em AÃ§Ãµes',
 *   userId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   annualInterestRate: SignedPercentage.create('10.5'),
 *   minAllocation: SignedPercentage.create('5'),
 *   maxAllocation: SignedPercentage.create('20'),
 *   targetAllocation: SignedPercentage.create('12'),
 * })
 *
 * PORTFOLIO.acronym
 * // 'FIA'
 * ```
 */
export class Portfolio {
  private readonly _id?: EntityId;
  private readonly props: Required<PortfolioProps>;

  /**
   * Returns the unique identifier of the portfolio.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the acronym of the portfolio.
   */
  get acronym(): string {
    return this.props.acronym;
  }

  /**
   * Returns the name of the portfolio.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Returns the id of the user the portfolio belongs to.
   */
  get userId(): EntityId {
    return this.props.userId;
  }

  /**
   * Returns the annual interest rate of the portfolio.
   */
  get annualInterestRate(): SignedPercentage {
    return this.props.annualInterestRate;
  }

  /**
   * Returns the minimum allocation of the portfolio.
   */
  get minAllocation(): SignedPercentage {
    return this.props.minAllocation;
  }

  /**
   * Returns the maximum allocation of the portfolio.
   */
  get maxAllocation(): SignedPercentage {
    return this.props.maxAllocation;
  }

  /**
   * Returns the target allocation of the portfolio.
   */
  get targetAllocation(): SignedPercentage {
    return this.props.targetAllocation;
  }

  /**
   * Returns the creation timestamp of the portfolio.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the portfolio.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Creates a `Portfolio`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Portfolio.create} and therefore satisfy the
   * portfolio's invariants.
   */
  private constructor(props: Required<PortfolioProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `Portfolio` from the provided properties.
   *
   * The timestamps default to the current time when not provided.
   *
   * @param props - The properties required to create the portfolio.
   * @param id - The unique identifier of the portfolio.
   *
   * @returns A valid `Portfolio` instance.
   *
   * @throws {ValidationError} If `props.acronym` is blank.
   * @throws {ValidationError} If `props.name` is blank.
   * @throws {ValidationError} If `props.userId` is blank.
   * @throws {ValidationError} If `props.annualInterestRate` is missing.
   * @throws {ValidationError} If `props.minAllocation` is missing.
   * @throws {ValidationError} If `props.maxAllocation` is missing.
   * @throws {ValidationError} If `props.targetAllocation` is missing.
   * @throws {ValidationError} If `props.annualInterestRate` is negative.
   * @throws {ValidationError} If `props.minAllocation` exceeds `props.targetAllocation`.
   * @throws {ValidationError} If `props.targetAllocation` exceeds `props.maxAllocation`.
   */
  public static create(props: PortfolioProps, id?: string): Portfolio {
    if (!props.acronym || props.acronym.trim() === "") {
      throw new ValidationError("Portfolio must have an acronym.");
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("Portfolio must have a name.");
    }
    if (!props.userId || props.userId.trim() === "") {
      throw new ValidationError("Portfolio must have a user id.");
    }
    if (!props.annualInterestRate) {
      throw new ValidationError("Portfolio must have an annual interest rate.");
    }
    if (!props.minAllocation) {
      throw new ValidationError("Portfolio must have a minimum allocation.");
    }
    if (!props.maxAllocation) {
      throw new ValidationError("Portfolio must have a maximum allocation.");
    }
    if (!props.targetAllocation) {
      throw new ValidationError("Portfolio must have a target allocation.");
    }
    if (props.annualInterestRate.isNegative) {
      throw new ValidationError(
        "Portfolio annual interest rate must not be negative.",
      );
    }
    if (props.minAllocation.value.gt(props.targetAllocation.value)) {
      throw new ValidationError(
        "Portfolio minimum allocation must not exceed target allocation.",
      );
    }
    if (props.targetAllocation.value.gt(props.maxAllocation.value)) {
      throw new ValidationError(
        "Portfolio target allocation must not exceed maximum allocation.",
      );
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<PortfolioProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Portfolio(NORMALIZED_PROPS, id);
  }

  /**
   * Updates the allocation bounds of this portfolio.
   *
   * The code returns a new `Portfolio` instance with the updated
   * allocation bounds, enforcing `min <= target <= max`.
   *
   * @param minAllocation - The new minimum allocation.
   * @param targetAllocation - The new target allocation.
   * @param maxAllocation - The new maximum allocation.
   * @param now - The update timestamp, defaulting to the current time.
   *
   * @returns A new `Portfolio` instance with the updated allocation.
   *
   * @throws {ValidationError} If `minAllocation` is missing.
   * @throws {ValidationError} If `targetAllocation` is missing.
   * @throws {ValidationError} If `maxAllocation` is missing.
   * @throws {ValidationError} If `minAllocation` exceeds `targetAllocation`.
   * @throws {ValidationError} If `targetAllocation` exceeds `maxAllocation`.
   */
  public updateAllocation(
    minAllocation: SignedPercentage,
    targetAllocation: SignedPercentage,
    maxAllocation: SignedPercentage,
    now?: Date,
  ): Portfolio {
    if (!minAllocation) {
      throw new ValidationError("Portfolio must have a minimum allocation.");
    }
    if (!targetAllocation) {
      throw new ValidationError("Portfolio must have a target allocation.");
    }
    if (!maxAllocation) {
      throw new ValidationError("Portfolio must have a maximum allocation.");
    }
    if (minAllocation.value.gt(targetAllocation.value)) {
      throw new ValidationError(
        "Portfolio minimum allocation must not exceed target allocation.",
      );
    }
    if (targetAllocation.value.gt(maxAllocation.value)) {
      throw new ValidationError(
        "Portfolio target allocation must not exceed maximum allocation.",
      );
    }

    const NOW = now ?? new Date();

    return new Portfolio(
      {
        ...this.props,
        minAllocation,
        targetAllocation,
        maxAllocation,
        updatedAt: NOW,
      },
      this._id,
    );
  }

  /**
   * Updates the annual interest rate of this portfolio.
   *
   * The code returns a new `Portfolio` instance with the updated annual
   * interest rate, which must not be negative.
   *
   * @param annualInterestRate - The new annual interest rate.
   * @param now - The update timestamp, defaulting to the current time.
   *
   * @returns A new `Portfolio` instance with the updated rate.
   *
   * @throws {ValidationError} If `annualInterestRate` is missing.
   * @throws {ValidationError} If `annualInterestRate` is negative.
   */
  public updateAnnualInterestRate(
    annualInterestRate: SignedPercentage,
    now?: Date,
  ): Portfolio {
    if (!annualInterestRate) {
      throw new ValidationError("Portfolio must have an annual interest rate.");
    }
    if (annualInterestRate.isNegative) {
      throw new ValidationError(
        "Portfolio annual interest rate must not be negative.",
      );
    }

    const NOW = now ?? new Date();

    return new Portfolio(
      {
        ...this.props,
        annualInterestRate,
        updatedAt: NOW,
      },
      this._id,
    );
  }

  /**
   * Determines whether this `Portfolio` represents the same portfolio as
   * the provided instance, based on referential equality and the unique id.
   *
   * @param object - The portfolio to compare against.
   * @returns `true` when both portfolios share the same id; otherwise,
   * `false`.
   */
  public equals(object?: Portfolio | null): boolean {
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
