import {
  EntityId,
  type PositiveMoney,
  type QuotaQuantity,
} from "@/value-objects"
import { ValidationError } from "@/errors"

export interface WithdrawalProps {
  positionId: EntityId
  date: Date
  amount: PositiveMoney
  quotas: QuotaQuantity
  reversedAt?: Date | null
  reversedByUserId?: EntityId | null
  version?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents a fund withdrawal made against a position.
 *
 * @remarks
 * Must have positionId, date, amount, quotas.
 * Instances immutable after creation.
 *
 * @explanation
 * Tracks withdrawal transactions with reversal support.
 * Links to position for **FIFO** allocation.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Withdrawal {
  private readonly _id?: EntityId
  private readonly props: Required<WithdrawalProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the withdrawal.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare withdrawals.
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
   * Returns the position ID of the withdrawal.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the position the withdrawal is made against.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get positionId(): EntityId {
    return this.props.positionId
  }

  /**
   * @summary
   * Returns the date of the withdrawal.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Fixes the trading day of the withdrawal.
   *
   * @returns Withdrawal Date.
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
   * Returns the amount of the withdrawal.
   *
   * @remarks
   * PositiveMoney value.
   *
   * @explanation
   * Cash value paid out by the withdrawal.
   *
   * @returns PositiveMoney.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get amount(): PositiveMoney {
    return this.props.amount
  }

  /**
   * @summary
   * Returns the quotas of the withdrawal.
   *
   * @remarks
   * QuotaQuantity value.
   *
   * @explanation
   * Quota count drawn for **FIFO** tax lot allocation.
   *
   * @returns QuotaQuantity.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get quotas(): QuotaQuantity {
    return this.props.quotas
  }

  /**
   * @summary
   * Returns the reversal date of the withdrawal, if any.
   *
   * @remarks
   * Nullable Date.
   *
   * @explanation
   * When set, marks the withdrawal as reversed.
   *
   * @returns Reversal Date or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get reversedAt(): Date | null {
    return this.props.reversedAt
      ? new Date(this.props.reversedAt)
      : null
  }

  /**
   * @summary
   * Returns the user ID who reversed the withdrawal, if any.
   *
   * @remarks
   * Nullable EntityId.
   *
   * @explanation
   * Identifies the user who reversed the withdrawal.
   *
   * @returns EntityId or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get reversedByUserId(): EntityId | null {
    return this.props.reversedByUserId
  }

  /**
   * @summary
   * Returns the optimistic-locking version of the withdrawal.
   *
   * @remarks
   * Required number, defaults to zero.
   *
   * @explanation
   * Guards concurrent updates in the repository.
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
   * Returns the creation timestamp of the withdrawal.
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
   * Returns the last update timestamp of the withdrawal.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Shows when the withdrawal last changed.
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
   * Creates a Withdrawal instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Withdrawal.create instead.
   *
   * @param props - Required withdrawal properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(
    props: Required<WithdrawalProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      date: new Date(props.date),
      reversedAt: props.reversedAt
        ? new Date(props.reversedAt)
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
   * Creates a valid Withdrawal from the provided properties.
   *
   * @remarks
   * Validates positionId, date, amount, quotas.
   * Optional fields default to null; timestamps to now.
   *
   * @explanation
   * Factory method to construct a valid Withdrawal.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the withdrawal.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Withdrawal.
   *
   * @example
   * const WITHDRAWAL = Withdrawal.create({
   *   positionId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   *   date: new Date("2026-01-01T00:00:00.000Z"),
   *   amount: PositiveMoney.create("500.00"),
   *   quotas: QuotaQuantity.create("6.123"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: WithdrawalProps,
    id?: string
  ): Withdrawal {
    if (!props.positionId || props.positionId.trim() === "") {
      throw new ValidationError(
        "`Withdrawal` must have a position id."
      )
    }
    if (!props.date) {
      throw new ValidationError("`Withdrawal` must have a date.")
    }
    if (!props.amount) {
      throw new ValidationError(
        "`Withdrawal` must have an amount."
      )
    }
    if (!props.quotas) {
      throw new ValidationError("`Withdrawal` must have quotas.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<WithdrawalProps> = {
      ...props,
      reversedAt: props.reversedAt ?? null,
      reversedByUserId: props.reversedByUserId ?? null,
      version: props.version ?? 0,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Withdrawal(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // MUTATIONS
  // ---------------------------------

  /**
   * @summary
   * Reverses this withdrawal.
   *
   * @remarks
   * Returns new reversed Withdrawal instance.
   * Cannot reverse already reversed withdrawal.
   *
   * @explanation
   * Cancels the withdrawal and records who reversed it.
   *
   * @param userId - Reversing user EntityId.
   * @param now - Reversal timestamp (optional, defaults to now).
   *
   * @returns Reversed Withdrawal.
   *
   * @example
   * const REVERSED = withdrawal.reverse(
   *   EntityId.create("user-id")
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public reverse(userId: EntityId, now?: Date): Withdrawal {
    if (this._id === undefined) {
      throw new ValidationError(
        "Cannot reverse a `Withdrawal` that has not been persisted."
      )
    }
    if (this.props.reversedAt !== null) {
      throw new ValidationError(
        "Cannot reverse a `Withdrawal` that is already reversed."
      )
    }

    const NOW = now ?? new Date()

    return new Withdrawal(
      {
        ...this.props,
        reversedAt: NOW,
        reversedByUserId: userId,
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
   * Compares this Withdrawal with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two withdrawals by their persisted identity.
   *
   * @param object - The Withdrawal to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = Withdrawal.create(PROPS, ID);
   * const B = Withdrawal.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Withdrawal | null): boolean {
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
