import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link Position}.
 *
 * The `initialBalance` and `initialBalanceDate` fields default to `null`,
 * and the timestamps default to the current time when not provided.
 *
 * Use {@link Position.create} to create a valid `Position` instance.
 */
interface PositionProps {
  portfolioId: EntityId;
  fundId: EntityId;
  initialBalance?: PositiveMoney | null;
  initialBalanceDate?: Date | null;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents the holding of a fund within a portfolio.
 *
 * A `Position`:
 * - must have a portfolio id.
 * - must have a fund id.
 *
 * `Position` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const POSITION = Position.create({
 *   portfolioId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   fundId: 'f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d',
 * })
 *
 * POSITION.portfolioId
 * // 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2'
 * ```
 */
export class Position {
  private readonly _id?: EntityId;
  private readonly props: Required<PositionProps>;

  /**
   * Returns the unique identifier of the position.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the id of the portfolio the position belongs to.
   */
  get portfolioId(): EntityId {
    return this.props.portfolioId;
  }

  /**
   * Returns the id of the fund held by the position.
   */
  get fundId(): EntityId {
    return this.props.fundId;
  }

  /**
   * Returns the initial balance of the position, if any.
   */
  get initialBalance(): PositiveMoney | null {
    return this.props.initialBalance;
  }

  /**
   * Returns the date of the initial balance, if any.
   */
  get initialBalanceDate(): Date | null {
    return this.props.initialBalanceDate;
  }

  /**
   * Returns the optimistic-locking version of the position.
   */
  get version(): number {
    return this.props.version;
  }

  /**
   * Returns the creation timestamp of the position.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the position.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Creates a `Position`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Position.create} and therefore satisfy the
   * position's invariants.
   */
  private constructor(props: Required<PositionProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `Position` from the provided properties.
   *
   * The `initialBalance` and `initialBalanceDate` fields default to
   * `null`, and the timestamps to the current time when those properties
   * are not provided.
   *
   * @param props - The properties required to create the position.
   * @param id - The unique identifier of the position.
   *
   * @returns A valid `Position` instance.
   *
   * @throws {ValidationError} If `props.portfolioId` is blank.
   * @throws {ValidationError} If `props.fundId` is blank.
   */
  public static create(props: PositionProps, id?: string): Position {
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new ValidationError("Position must have a portfolio id.");
    }
    if (!props.fundId || props.fundId.trim() === "") {
      throw new ValidationError("Position must have a fund id.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<PositionProps> = {
      ...props,
      initialBalance: props.initialBalance ?? null,
      initialBalanceDate: props.initialBalanceDate ?? null,
      version: props.version ?? 0,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Position(NORMALIZED_PROPS, id);
  }

  /**
   * Sets the initial balance of this position.
   *
   * The code returns a new `Position` instance with the initial balance
   * and its effective date recorded. The optimistic-locking version is
   * incremented, so the next persistence detects concurrent updates.
   *
   * @param initialBalance - The new initial balance of the position.
   * @param date - The effective date of the initial balance.
   * @param now - The update timestamp, defaulting to the current time.
   *
   * @returns A new `Position` instance with the updated initial balance.
   */
  public setInitialBalance(
    initialBalance: PositiveMoney,
    date: Date,
    now?: Date,
  ): Position {
    if (this._id === undefined) {
      throw new ValidationError(
        "Cannot set an initial balance on a position that has not been persisted.",
      );
    }
    if (!initialBalance) {
      throw new ValidationError("Position initial balance must be defined.");
    }
    if (!date) {
      throw new ValidationError(
        "Position initial balance date must be defined.",
      );
    }

    const NOW = now ?? new Date();

    return new Position(
      {
        ...this.props,
        initialBalance,
        initialBalanceDate: date,
        version: this.props.version + 1,
        updatedAt: NOW,
      },
      this._id,
    );
  }

  /**
   * Determines whether this `Position` represents the same position as
   * the provided instance, based on referential equality and the unique id.
   *
   * @param object - The position to compare against.
   * @returns `true` when both positions share the same id; otherwise,
   * `false`.
   */
  public equals(object?: Position | null): boolean {
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
