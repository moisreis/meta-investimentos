import type SignedPercentage from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the properties required to create a {@link Fund}.
 *
 * The administration fee, performance fee, benchmark id, and category id
 * default to `null`, and the timestamps default to the current time when
 * not provided.
 *
 * Use {@link Fund.create} to create a valid `Fund` instance.
 */
interface FundProps {
  cnpj: string;
  name: string;
  administrationFee?: SignedPercentage | null;
  performanceFee?: SignedPercentage | null;
  bankId: string;
  benchmarkId?: string | null;
  categoryId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents an investment fund.
 *
 * A `Fund`:
 * - must have a cnpj.
 * - must have a name.
 * - must have a bank id.
 *
 * `Fund` instances are immutable after creation.
 */
export class Fund {
  private readonly _id?: string;
  private readonly props: Required<FundProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the fund.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the cnpj of the fund.
   */
  get cnpj(): string {
    return this.props.cnpj;
  }

  /**
   * Returns the name of the fund.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Returns the administration fee of the fund.
   */
  get administrationFee(): SignedPercentage | null {
    return this.props.administrationFee;
  }

  /**
   * Returns the performance fee of the fund.
   */
  get performanceFee(): SignedPercentage | null {
    return this.props.performanceFee;
  }

  /**
   * Returns the id of the bank the fund belongs to.
   */
  get bankId(): string {
    return this.props.bankId;
  }

  /**
   * Returns the id of the benchmark the fund is compared against.
   */
  get benchmarkId(): string | null {
    return this.props.benchmarkId;
  }

  /**
   * Returns the id of the category the fund belongs to.
   */
  get categoryId(): string | null {
    return this.props.categoryId;
  }

  /**
   * Returns the creation timestamp of the fund.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the fund.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `Fund`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Fund.create} and therefore satisfy the
   * fund's invariants.
   */
  private constructor(props: Required<FundProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `Fund` from the provided properties.
   *
   * The administration fee, performance fee, benchmark id, and category
   * id default to `null`, and the timestamps to the current time when
   * those properties are not provided.
   *
   * @param props - The properties required to create the fund.
   * @param id - The unique identifier of the fund.
   *
   * @returns A valid `Fund` instance.
   *
   * @throws {Error} If `props.cnpj` is blank.
   * @throws {Error} If `props.name` is blank.
   * @throws {Error} If `props.bankId` is blank.
   */
  public static create(props: FundProps, id?: string): Fund {
    if (!props.cnpj || props.cnpj.trim() === "") {
      throw new Error("Fund must have a cnpj.");
    }
    if (!props.name || props.name.trim() === "") {
      throw new Error("Fund must have a name.");
    }
    if (!props.bankId || props.bankId.trim() === "") {
      throw new Error("Fund must have a bank id.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<FundProps> = {
      ...props,
      administrationFee: props.administrationFee ?? null,
      performanceFee: props.performanceFee ?? null,
      benchmarkId: props.benchmarkId ?? null,
      categoryId: props.categoryId ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Fund(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `Fund` represents the same fund as the
   * provided instance, based on referential equality and the unique id.
   *
   * @param object - The fund to compare against.
   * @returns `true` when both funds share the same id; otherwise, `false`.
   */
  public equals(object?: Fund | null): boolean {
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
