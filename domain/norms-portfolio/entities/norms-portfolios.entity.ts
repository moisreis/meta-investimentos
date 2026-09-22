import { EntityId, type SignedPercentage } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface NormsPortfoliosProps {
  normId: EntityId
  portfolioId: EntityId
  minAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  targetAllocation: SignedPercentage
  version?: number
  createdAt?: Date
}

/**
 * @summary
 * Represents norm-portfolio relationship with allocation limits.
 *
 * @remarks
 * Must have normId, portfolioId, and min/max/target
 * allocation percentages.
 * Instances are immutable after creation.
 *
 * @explanation
 * Links a regulatory norm to a portfolio with specific limits.
 * Enforces min <= target <= max.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class NormsPortfolios {
  private readonly _id?: EntityId
  private readonly props: Required<NormsPortfoliosProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the relation.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare relations.
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
   * Returns the norm ID of the relation.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the regulatory norm applied to the portfolio.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get normId(): EntityId {
    return this.props.normId
  }

  /**
   * @summary
   * Returns the portfolio ID of the relation.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the portfolio bound by the norm limits.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get portfolioId(): EntityId {
    return this.props.portfolioId
  }

  /**
   * @summary
   * Returns the minimum allocation of the relation.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Lower bound used for allocation compliance checks.
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
   * Returns the maximum allocation of the relation.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Upper bound used for allocation compliance checks.
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
   * Returns the target allocation of the relation.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Desired value used for allocation compliance checks.
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
   * Returns the optimistic-locking version of the relation.
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
   * Returns the creation timestamp of the relation.
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

  // ---------------------------------
  // CONSTRUCTION
  // ---------------------------------

  /**
   * @summary
   * Creates a NormsPortfolios instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use NormsPortfolios.create instead.
   *
   * @param props - Required relation properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<NormsPortfoliosProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      createdAt: new Date(props.createdAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid NormsPortfolios from the props.
   *
   * @remarks
   * Validates all fields and enforces min <= target <= max.
   * createdAt defaults to current time.
   *
   * @explanation
   * Factory method to construct a valid NormsPortfolios.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the relation.
   * @param id - Optional unique identifier.
   *
   * @returns Valid NormsPortfolios.
   *
   * @example
   * const RELATION = NormsPortfolios.create({
   *   normId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   *   portfolioId: EntityId.create(
   *     "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"
   *   ),
   *   minAllocation: SignedPercentage.create("5"),
   *   maxAllocation: SignedPercentage.create("20"),
   *   targetAllocation: SignedPercentage.create("12"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: NormsPortfoliosProps,
    id?: string
  ): NormsPortfolios {
    if (!props.normId || props.normId.trim() === "") {
      throw new ValidationError("`NormsPortfolios` must have a norm id.")
    }
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new ValidationError("`NormsPortfolios` must have a portfolio id.")
    }
    if (!props.minAllocation) {
      throw new ValidationError(
        "`NormsPortfolios` must have a minimum allocation."
      )
    }
    if (!props.maxAllocation) {
      throw new ValidationError(
        "`NormsPortfolios` must have a maximum allocation."
      )
    }
    if (!props.targetAllocation) {
      throw new ValidationError(
        "`NormsPortfolios` must have a target allocation."
      )
    }
    if (props.minAllocation.value.gt(props.targetAllocation.value)) {
      throw new ValidationError(
        "`NormsPortfolios` minimum allocation must not exceed target allocation."
      )
    }
    if (props.targetAllocation.value.gt(props.maxAllocation.value)) {
      throw new ValidationError(
        "`NormsPortfolios` target allocation must not exceed maximum allocation."
      )
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<NormsPortfoliosProps> = {
      ...props,
      version: props.version ?? 0,
      createdAt: props.createdAt ?? NOW,
    }

    return new NormsPortfolios(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this NormsPortfolios with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two relations by their persisted identity.
   *
   * @param object - The NormsPortfolios to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = NormsPortfolios.create(PROPS, ID);
   * const B = NormsPortfolios.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: NormsPortfolios | null): boolean {
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
