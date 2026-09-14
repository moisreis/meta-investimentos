import {
  EntityId,
  type PositiveMoney,
  type QuotaQuantity,
} from "@/value-objects";
import { ValidationError } from "@/errors";

interface WithdrawalProps {
  positionId: EntityId;
  date: Date;
  amount: PositiveMoney;
  quotas: QuotaQuantity;
  reversedAt?: Date | null;
  reversedByUserId?: EntityId | null;
  createdAt?: Date;
  updatedAt?: Date;
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
 * Links to position for FIFO allocation.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Withdrawal {
  private readonly _id?: EntityId;
  private readonly props: Required<WithdrawalProps>;

  /**
   * @summary
   * Returns the unique identifier of the withdrawal.
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
   * Returns the position ID of the withdrawal.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to associate withdrawal with position.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get positionId(): EntityId {
    return this.props.positionId;
  }

  /**
   * @summary
   * Returns the date of the withdrawal.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Use for time-series queries.
   *
   * @returns Withdrawal Date.
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
   * Returns the amount of the withdrawal.
   *
   * @remarks
   * PositiveMoney value.
   *
   * @explanation
   * Use for cash flow tracking.
   *
   * @returns PositiveMoney.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get amount(): PositiveMoney {
    return this.props.amount;
  }

  /**
   * @summary
   * Returns the quotas of the withdrawal.
   *
   * @remarks
   * QuotaQuantity value.
   *
   * @explanation
   * Use for FIFO tax lot allocation.
   *
   * @returns QuotaQuantity.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get quotas(): QuotaQuantity {
    return this.props.quotas;
  }

  /**
   * @summary
   * Returns the reversal date of the withdrawal, if any.
   *
   * @remarks
   * Nullable Date.
   *
   * @explanation
   * Use to check if withdrawal was reversed.
   *
   * @returns Reversal Date or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get reversedAt(): Date | null {
    return this.props.reversedAt;
  }

  /**
   * @summary
   * Returns the user ID who reversed the withdrawal, if any.
   *
   * @remarks
   * Nullable EntityId.
   *
   * @explanation
   * Use for audit trail.
   *
   * @returns EntityId or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get reversedByUserId(): EntityId | null {
    return this.props.reversedByUserId;
  }

  /**
   * @summary
   * Returns the creation timestamp of the withdrawal.
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
   * Returns the last update timestamp of the withdrawal.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Use for audit and cache invalidation.
   *
   * @returns Last update Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

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
  private constructor(props: Required<WithdrawalProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

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
   * @returns Valid Withdrawal instance.
   *
   * @example
   * const WITHDRAWAL = Withdrawal.create({
   *   positionId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   *   date: new Date("2026-01-01T00:00:00.000Z"),
   *   amount: PositiveMoney.create("500.00"),
   *   quotas: QuotaQuantity.create("6.123"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: WithdrawalProps, id?: string): Withdrawal {
    if (!props.positionId || props.positionId.trim() === "") {
      throw new ValidationError("Withdrawal must have a position id.");
    }
    if (!props.date) {
      throw new ValidationError("Withdrawal must have a date.");
    }
    if (!props.amount) {
      throw new ValidationError("Withdrawal must have an amount.");
    }
    if (!props.quotas) {
      throw new ValidationError("Withdrawal must have quotas.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<WithdrawalProps> = {
      ...props,
      reversedAt: props.reversedAt ?? null,
      reversedByUserId: props.reversedByUserId ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Withdrawal(NORMALIZED_PROPS, id);
  }

  /**
   * @summary
   * Reverses this withdrawal.
   *
   * @remarks
   * Returns new reversed Withdrawal instance.
   * Cannot reverse already reversed withdrawal.
   *
   * @explanation
   * Use to cancel a withdrawal.
   * Records reversal timestamp and user.
   *
   * @param userId - Reversing user EntityId.
   * @param now - Reversal timestamp (optional, defaults to now).
   *
   * @returns New reversed Withdrawal instance.
   *
   * @example
   * const REVERSED = withdrawal.reverse(EntityId.create("user-id"));
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public reverse(userId: EntityId, now?: Date): Withdrawal {
    if (this._id === undefined) {
      throw new ValidationError(
        "Cannot reverse a withdrawal that has not been persisted.",
      );
    }
    if (this.props.reversedAt !== null) {
      throw new ValidationError(
        "Cannot reverse a withdrawal that is already reversed.",
      );
    }

    const NOW = now ?? new Date();

    return new Withdrawal(
      {
        ...this.props,
        reversedAt: NOW,
        reversedByUserId: userId,
        updatedAt: NOW,
      },
      this._id,
    );
  }

  /**
   * @summary
   * Compares this Withdrawal with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The Withdrawal to compare against.
   *
   * @returns True if both share the same ID.
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
