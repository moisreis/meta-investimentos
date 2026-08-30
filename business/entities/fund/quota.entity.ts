import type QuotaPrice from "@/business/value-objects/quota-price.vo";

/**
 * Represents the properties required to create a {@link Quota}.
 *
 * The creation timestamp defaults to the current time when not
 * provided.
 *
 * Use {@link Quota.create} to create a valid `Quota` instance.
 */
interface QuotaProps {
  fundId: string;
  date: Date;
  price: QuotaPrice;
  createdAt?: Date;
}

/**
 * Represents the unit price of a fund on a given date.
 *
 * A `Quota`:
 * - must have a fund id.
 * - must have a date.
 * - must have a price.
 *
 * `Quota` instances are immutable after creation.
 */
export class Quota {
  private readonly _id?: string;
  private readonly props: Required<QuotaProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the quota.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the id of the fund the quota belongs to.
   */
  get fundId(): string {
    return this.props.fundId;
  }

  /**
   * Returns the date the quota refers to.
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * Returns the price of the quota.
   */
  get price(): QuotaPrice {
    return this.props.price;
  }

  /**
   * Returns the creation timestamp of the quota.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `Quota`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Quota.create} and therefore satisfy the
   * quota's invariants.
   */
  private constructor(props: Required<QuotaProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `Quota` from the provided properties.
   *
   * The creation timestamp defaults to the current time when that
   * property is not provided.
   *
   * @param props - The properties required to create the quota.
   * @param id - The unique identifier of the quota.
   *
   * @returns A valid `Quota` instance.
   *
   * @throws {Error} If `props.fundId` is blank.
   * @throws {Error} If `props.date` is not provided.
   * @throws {Error} If `props.price` is not provided.
   */
  public static create(props: QuotaProps, id?: string): Quota {
    if (!props.fundId || props.fundId.trim() === "") {
      throw new Error("Quota must have a fund id.");
    }
    if (!props.date) {
      throw new Error("Quota must have a date.");
    }
    if (!props.price) {
      throw new Error("Quota must have a price.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<QuotaProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    };

    return new Quota(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `Quota` represents the same quota as the
   * provided instance, based on referential equality and the unique id.
   *
   * @param object - The quota to compare against.
   * @returns `true` when both quotas share the same id; otherwise, `false`.
   */
  public equals(object?: Quota | null): boolean {
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
