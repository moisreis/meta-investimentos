import { EntityId, type SignedMoney } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface CheckingAccountProps {
  bankAccountId: EntityId
  date: Date
  value: SignedMoney
}

/**
 * @summary
 * Represents a checking account transaction of a bank account.
 *
 * @remarks
 * Must have bankAccountId, date, value. Instances immutable after creation.
 *
 * @explanation
 * Stores bank account transaction history.
 * Supports value updates.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class CheckingAccount {
  private readonly _id?: EntityId
  private readonly props: Required<CheckingAccountProps>

  /**
   * @summary
   * Returns the unique identifier of the checking account.
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
    return this._id
  }

  /**
   * @summary
   * Returns the bank account ID of the transaction.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to associate transaction with bank account.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get bankAccountId(): EntityId {
    return this.props.bankAccountId
  }

  /**
   * @summary
   * Returns the date of the checking account transaction.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Use for time-series queries.
   *
   * @returns Transaction Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get date(): Date {
    return this.props.date
  }

  /**
   * @summary
   * Returns the value of the checking account transaction.
   *
   * @remarks
   * SignedMoney value.
   *
   * @explanation
   * Use for cash flow tracking.
   *
   * @returns SignedMoney.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get value(): SignedMoney {
    return this.props.value
  }

  /**
   * @summary
   * Creates a CheckingAccount instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use CheckingAccount.create instead.
   *
   * @param props - Required transaction properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<CheckingAccountProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze(props)
  }

  /**
   * @summary
   * Creates a valid CheckingAccount from the provided properties.
   *
   * @remarks
   * Validates bankAccountId, date, value.
   *
   * @explanation
   * Factory method to construct a valid CheckingAccount.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the transaction.
   * @param id - Optional unique identifier.
   *
   * @returns Valid CheckingAccount instance.
   *
   * @example
   * const TX = CheckingAccount.create({
   *   bankAccountId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   *   date: new Date("2026-01-01T00:00:00.000Z"),
   *   value: SignedMoney.create("-123.45"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: CheckingAccountProps,
    id?: string
  ): CheckingAccount {
    if (!props.bankAccountId || props.bankAccountId.trim() === "") {
      throw new ValidationError(
        "`CheckingAccount` must have a bank account id."
      )
    }
    if (!props.date) {
      throw new ValidationError("`CheckingAccount` must have a date.")
    }
    if (!props.value) {
      throw new ValidationError("`CheckingAccount` must have a value.")
    }

    const NORMALIZED_PROPS: Required<CheckingAccountProps> = {
      ...props,
    }

    return new CheckingAccount(NORMALIZED_PROPS, id)
  }

  /**
   * @summary
   * Updates the value of this checking account transaction.
   *
   * @remarks
   * Returns new CheckingAccount instance with updated value.
   *
   * @explanation
   * Use to correct transaction amounts.
   * Original instance unchanged.
   *
   * @param value - New SignedMoney value.
   *
   * @returns New CheckingAccount instance with updated value.
   *
   * @example
   * const UPDATED = tx.updateValue(SignedMoney.create("-150.00"));
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public updateValue(value: SignedMoney): CheckingAccount {
    if (!value) {
      throw new ValidationError("`CheckingAccount` must have a value.")
    }

    return new CheckingAccount(
      {
        ...this.props,
        value,
      },
      this._id
    )
  }

  /**
   * @summary
   * Compares this CheckingAccount with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The CheckingAccount to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = CheckingAccount.create(PROPS, ID);
   * const B = CheckingAccount.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: CheckingAccount | null): boolean {
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
