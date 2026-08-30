import type SignedPercentage from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the properties required to create a
 * {@link NormsPortfolios}.
 *
 * The `createdAt` timestamp defaults to the current time when not provided.
 *
 * Use {@link NormsPortfolios.create} to create a valid `NormsPortfolios`
 * instance.
 */
interface NormsPortfoliosProps {
  normId: string;
  portfolioId: string;
  minAllocation: SignedPercentage;
  maxAllocation: SignedPercentage;
  targetAllocation: SignedPercentage;
  createdAt?: Date;
}

/**
 * Represents the relationship between a norm and a portfolio, holding the
 * allocation limits applied by the norm to the portfolio.
 *
 * A `NormsPortfolios`:
 * - must have a norm id.
 * - must have a portfolio id.
 * - must have a minimum allocation.
 * - must have a maximum allocation.
 * - must have a target allocation.
 *
 * `NormsPortfolios` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const RELATION = NormsPortfolios.create({
 *   normId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   portfolioId: 'f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d',
 *   minAllocation: SignedPercentage.create('5'),
 *   maxAllocation: SignedPercentage.create('20'),
 *   targetAllocation: SignedPercentage.create('12'),
 * })
 *
 * RELATION.normId
 * // 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2'
 * ```
 */
export class NormsPortfolios {
  private readonly _id?: string;
  private readonly props: Required<NormsPortfoliosProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the norms-portfolios relation.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the id of the norm of the relation.
   */
  get normId(): string {
    return this.props.normId;
  }

  /**
   * Returns the id of the portfolio of the relation.
   */
  get portfolioId(): string {
    return this.props.portfolioId;
  }

  /**
   * Returns the minimum allocation of the relation.
   */
  get minAllocation(): SignedPercentage {
    return this.props.minAllocation;
  }

  /**
   * Returns the maximum allocation of the relation.
   */
  get maxAllocation(): SignedPercentage {
    return this.props.maxAllocation;
  }

  /**
   * Returns the target allocation of the relation.
   */
  get targetAllocation(): SignedPercentage {
    return this.props.targetAllocation;
  }

  /**
   * Returns the creation timestamp of the norms-portfolios relation.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `NormsPortfolios`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link NormsPortfolios.create} and therefore satisfy
   * the norms-portfolios relation's invariants.
   */
  private constructor(props: Required<NormsPortfoliosProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `NormsPortfolios` from the provided properties.
   *
   * The `createdAt` timestamp defaults to the current time when not
   * provided.
   *
   * @param props - The properties required to create the norms-portfolios
   * relation.
   * @param id - The unique identifier of the norms-portfolios relation.
   *
   * @returns A valid `NormsPortfolios` instance.
   *
   * @throws {Error} If `props.normId` is blank.
   * @throws {Error} If `props.portfolioId` is blank.
   * @throws {Error} If `props.minAllocation` is missing.
   * @throws {Error} If `props.maxAllocation` is missing.
   * @throws {Error} If `props.targetAllocation` is missing.
   */
  public static create(
    props: NormsPortfoliosProps,
    id?: string,
  ): NormsPortfolios {
    if (!props.normId || props.normId.trim() === "") {
      throw new Error("NormsPortfolios must have a norm id.");
    }
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new Error("NormsPortfolios must have a portfolio id.");
    }
    if (!props.minAllocation) {
      throw new Error("NormsPortfolios must have a minimum allocation.");
    }
    if (!props.maxAllocation) {
      throw new Error("NormsPortfolios must have a maximum allocation.");
    }
    if (!props.targetAllocation) {
      throw new Error("NormsPortfolios must have a target allocation.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<NormsPortfoliosProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    };

    return new NormsPortfolios(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `NormsPortfolios` represents the same
   * norms-portfolios relation as the provided instance, based on
   * referential equality and the unique id.
   *
   * @param object - The norms-portfolios relation to compare against.
   * @returns `true` when both relations share the same id; otherwise,
   * `false`.
   */
  public equals(object?: NormsPortfolios | null): boolean {
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
