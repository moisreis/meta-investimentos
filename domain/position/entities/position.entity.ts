import { EntityId, type PositiveMoney } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface PositionProps {
  portfolioId: EntityId
  fundId: EntityId
  initialBalance?: PositiveMoney | null
  initialBalanceDate?: Date | null
  version?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents the holding of a fund within a portfolio.
 *
 * @remarks
 * Must have portfolioId and fundId.
 * Instances immutable after creation.
 *
 * @explanation
 * Core position entity linking portfolio to fund.
 * Tracks initial balance for performance calc.
 * Supports optimistic locking via version.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Position {
  private readonly _id?: EntityId
  private readonly props: Required<PositionProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the position.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare positions.
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
   * Returns the portfolio ID of the position.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the portfolio that holds the fund.
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
   * Returns the fund ID held by the position.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the fund held by the position.
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
   * Returns the initial balance of the position, if any.
   *
   * @remarks
   * Nullable PositiveMoney.
   *
   * @explanation
   * Starting value used as the performance baseline.
   *
   * @returns PositiveMoney or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get initialBalance(): PositiveMoney | null {
    return this.props.initialBalance
  }

  /**
   * @summary
   * Returns the date of the initial balance, if any.
   *
   * @remarks
   * Nullable Date.
   *
   * @explanation
   * Marks the start of the performance period.
   *
   * @returns Initial balance or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get initialBalanceDate(): Date | null {
    return this.props.initialBalanceDate
      ? new Date(this.props.initialBalanceDate)
      : null
  }

  /**
   * @summary
   * Returns the optimistic-locking version of the position.
   *
   * @remarks
   * Number, defaults to 0.
   *
   * @explanation
   * Guards concurrent updates in the repository.
   *
   * @returns Version number.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get version(): number {
    return this.props.version
  }

  /**
   * @summary
   * Returns the creation timestamp of the position.
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
   * Returns the last update timestamp of the position.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Shows when the position last changed.
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
   * Creates a Position instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Position.create instead.
   *
   * @param props - Required position properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<PositionProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      initialBalanceDate: props.initialBalanceDate
        ? new Date(props.initialBalanceDate)
        : null,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid Position from the provided properties.
   *
   * @remarks
   * Validates portfolioId and fundId.
   * Optional fields default; version defaults to 0;
   * timestamps to now.
   *
   * @explanation
   * Factory method to construct a valid Position.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the position.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Position.
   *
   * @example
   * const POSITION = Position.create({
   *   portfolioId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   *   fundId: EntityId.create(
   *     "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"
   *   ),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: PositionProps, id?: string): Position {
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new ValidationError("`Position` must have a portfolio id.")
    }
    if (!props.fundId || props.fundId.trim() === "") {
      throw new ValidationError("`Position` must have a fund id.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<PositionProps> = {
      ...props,
      initialBalance: props.initialBalance ?? null,
      initialBalanceDate: props.initialBalanceDate ?? null,
      version: props.version ?? 0,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Position(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // MUTATIONS
  // ---------------------------------

  /**
   * @summary
   * Sets the initial balance of this position.
   *
   * @remarks
   * Returns new Position with initial balance and date.
   * Version unchanged (bumped by repository on persist).
   *
   * @explanation
   * Records the starting balance for performance.
   * Requires a persisted position (has an ID).
   *
   * @param initialBalance - New initial PositiveMoney.
   * @param date - Effective date of initial balance.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns Updated Position.
   *
   * @example
   * const UPDATED = position.setInitialBalance(
   *   PositiveMoney.create("10000"),
   *   new Date("2026-01-01"),
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public setInitialBalance(
    initialBalance: PositiveMoney,
    date: Date,
    now?: Date
  ): Position {
    if (this._id === undefined) {
      throw new ValidationError(
        "Cannot set an initial balance on a `Position` that has not been persisted."
      )
    }
    if (!initialBalance) {
      throw new ValidationError("`Position` initial balance must be defined.")
    }
    if (!date) {
      throw new ValidationError(
        "`Position` initial balance date must be defined."
      )
    }

    const NOW = now ?? new Date()

    return new Position(
      {
        ...this.props,
        initialBalance,
        initialBalanceDate: date,
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
   * Compares this Position with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two positions by their persisted identity.
   *
   * @param object - The Position to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = Position.create(PROPS, ID);
   * const B = Position.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Position | null): boolean {
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
