import { EntityId, type QuotaPrice } from "@/value-objects";
import { ValidationError } from "@/errors";

interface QuotaProps {
  fundId: EntityId;
  date: Date;
  price: QuotaPrice;
  createdAt?: Date;
}

/**
 * @summary
 * Represents the unit price of a fund on a given date.
 *
 * @remarks
 * Must have fundId, date, price. Instances immutable after creation.
 *
 * @explanation
 * Stores daily fund quota prices for valuation and returns.
 * Supports price updates.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Quota {
  private readonly _id?: EntityId;
  private readonly props: Required<QuotaProps>;

  /**
   * @summary
   * Returns the unique identifier of the quota.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Use for persistence and equality checks.
   *
   * @returns EntityId or undefined.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * @summary
   * Returns the fund ID of the quota.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to associate quota with fund.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get fundId(): EntityId {
    return this.props.fundId;
  }

  /**
   * @summary
   * Returns the date the quota refers to.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Use for time-series queries.
   *
   * @returns Quota Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * @summary
   * Returns the price of the quota.
   *
   * @remarks
   * QuotaPrice value.
   *
   * @explanation
   * Use for valuation and return calculations.
   *
   * @returns QuotaPrice.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get price(): QuotaPrice {
    return this.props.price;
  }

  /**
   * @summary
   * Returns the creation timestamp of the quota.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Use for audit and ordering.
   *
   * @returns Creation Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * @summary
   * Creates a Quota instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Quota.create instead.
   *
   * @param props - Required quota properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<QuotaProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * @summary
   * Creates a valid Quota from the provided properties.
   *
   * @remarks
   * Validates fundId, date, price. createdAt defaults to now.
   *
   * @explanation
   * Factory method to construct a valid Quota.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the quota.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Quota instance.
   *
   * @example
   * const QUOTA = Quota.create({
   *   fundId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   *   date: new Date("2026-01-01"),
   *   price: QuotaPrice.create("4.50"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: QuotaProps, id?: string): Quota {
    if (!props.fundId || props.fundId.trim() === "") {
      throw new ValidationError("`Quota` must have a fund id.");
    }
    if (!props.date) {
      throw new ValidationError("`Quota` must have a date.");
    }
    if (!props.price) {
      throw new ValidationError("`Quota` must have a price.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<QuotaProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    };

    return new Quota(NORMALIZED_PROPS, id);
  }

  /**
   * @summary
   * Updates the price of this quota.
   *
   * @remarks
   * Returns new Quota instance with updated price.
   *
   * @explanation
   * Use to correct or update quota prices.
   * Original instance unchanged.
   *
   * @param price - New QuotaPrice.
   *
   * @returns New Quota instance with updated price.
   *
   * @example
   * const UPDATED = quota.updatePrice(QuotaPrice.create("4.55"));
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public updatePrice(price: QuotaPrice): Quota {
    if (!price) {
      throw new ValidationError("`Quota` must have a price.");
    }

    return new Quota(
      {
        ...this.props,
        price,
      },
      this._id,
    );
  }

  /**
   * @summary
   * Compares this Quota with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The Quota to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = Quota.create(PROPS, ID);
   * const B = Quota.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
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
