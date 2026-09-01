import { EntityId } from "@/business/value-objects/entity-id.vo";
import type PositiveMoney from "@/business/value-objects/positive-money.vo";
import type QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link Withdrawal}.
 *
 * The `reversedAt` and `reversedByUserId` fields default to `null`, and the
 * timestamps default to the current time when not provided.
 *
 * Use {@link Withdrawal.create} to create a valid `Withdrawal` instance.
 */
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
 * Represents a fund withdrawal made against a position.
 *
 * A `Withdrawal`:
 * - must have a position id.
 * - must have a date.
 * - must have an amount.
 * - must have quotas.
 *
 * `Withdrawal` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const WITHDRAWAL = Withdrawal.create({
 *   positionId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   date: new Date('2026-01-01T00:00:00.000Z'),
 *   amount: PositiveMoney.create('500.00'),
 *   quotas: QuotaQuantity.create('6.123'),
 * })
 *
 * WITHDRAWAL.amount.value.toString()
 * // '500'
 * ```
 */
export class Withdrawal {
  private readonly _id?: EntityId;
  private readonly props: Required<WithdrawalProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the withdrawal.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the id of the position the withdrawal belongs to.
   */
  get positionId(): EntityId {
    return this.props.positionId;
  }

  /**
   * Returns the date of the withdrawal.
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * Returns the amount of the withdrawal.
   */
  get amount(): PositiveMoney {
    return this.props.amount;
  }

  /**
   * Returns the number of quotas of the withdrawal.
   */
  get quotas(): QuotaQuantity {
    return this.props.quotas;
  }

  /**
   * Returns the date the withdrawal was reversed, if any.
   */
  get reversedAt(): Date | null {
    return this.props.reversedAt;
  }

  /**
   * Returns the id of the user who reversed the withdrawal, if any.
   */
  get reversedByUserId(): EntityId | null {
    return this.props.reversedByUserId;
  }

  /**
   * Returns the creation timestamp of the withdrawal.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the withdrawal.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `Withdrawal`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Withdrawal.create} and therefore satisfy
   * the withdrawal's invariants.
   */
  private constructor(props: Required<WithdrawalProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `Withdrawal` from the provided properties.
   *
   * The `reversedAt` and `reversedByUserId` fields default to `null`,
   * and the timestamps to the current time when those properties are
   * not provided.
   *
   * @param props - The properties required to create the withdrawal.
   * @param id - The unique identifier of the withdrawal.
   *
   * @returns A valid `Withdrawal` instance.
   *
   * @throws {ValidationError} If `props.positionId` is blank.
   * @throws {ValidationError} If `props.date` is missing.
   * @throws {ValidationError} If `props.amount` is missing.
   * @throws {ValidationError} If `props.quotas` is missing.
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

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `Withdrawal` represents the same withdrawal
   * as the provided instance, based on referential equality and the
   * unique id.
   *
   * @param object - The withdrawal to compare against.
   * @returns `true` when both withdrawals share the same id; otherwise,
   * `false`.
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
