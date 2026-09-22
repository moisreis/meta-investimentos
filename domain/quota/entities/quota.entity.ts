import { EntityId, type QuotaPrice } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface QuotaProps {
  fundId: EntityId
  date: Date
  price: QuotaPrice
  createdAt?: Date
}

/**
 * @summary
 * Represents the unit price of a fund on a given date.
 *
 * @remarks
 * Must have fundId, date, price.
 * Instances immutable after creation.
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
  private readonly _id?: EntityId
  private readonly props: Required<QuotaProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the quota.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare quotas.
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
   * Returns the fund ID of the quota.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the fund the quota price belongs to.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get fundId(): EntityId {
    return this.props.fundId
  }

  /**
   * @summary
   * Returns the date the quota refers to.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Fixes the trading day of the quoted price.
   *
   * @returns Quota Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get date(): Date {
    return new Date(this.props.date)
  }

  /**
   * @summary
   * Returns the price of the quota.
   *
   * @remarks
   * QuotaPrice value.
   *
   * @explanation
   * Unit value used for valuation and returns.
   *
   * @returns QuotaPrice.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get price(): QuotaPrice {
    return this.props.price
  }

  /**
   * @summary
   * Returns the creation timestamp of the quota.
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
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      date: new Date(props.date),
      createdAt: new Date(props.createdAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

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
   * @returns Valid Quota.
   *
   * @example
   * const QUOTA = Quota.create({
   *   fundId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
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
      throw new ValidationError("`Quota` must have a fund id.")
    }
    if (!props.date) {
      throw new ValidationError("`Quota` must have a date.")
    }
    if (!props.price) {
      throw new ValidationError("`Quota` must have a price.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<QuotaProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    }

    return new Quota(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // MUTATIONS
  // ---------------------------------

  /**
   * @summary
   * Updates the price of this quota.
   *
   * @remarks
   * Returns new Quota instance with updated price.
   *
   * @explanation
   * Corrects or updates the quoted unit price.
   * Original instance unchanged.
   *
   * @param price - New QuotaPrice.
   *
   * @returns Updated Quota.
   *
   * @example
   * const UPDATED = quota.updatePrice(
   *   QuotaPrice.create("4.55")
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public updatePrice(price: QuotaPrice): Quota {
    if (!price) {
      throw new ValidationError("`Quota` must have a price.")
    }

    return new Quota(
      {
        ...this.props,
        price,
      },
      this._id
    )
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this Quota with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two quotas by their persisted identity.
   *
   * @param object - The Quota to compare against.
   *
   * @returns True when both IDs match.
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
