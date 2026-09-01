import { EntityId } from "@/business/value-objects/entity-id.vo";
import type SignedMoney from "@/business/value-objects/signed-money.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link CheckingAccount}.
 *
 * Use {@link CheckingAccount.create} to create a valid
 * `CheckingAccount` instance.
 */
interface CheckingAccountProps {
  bankAccountId: EntityId;
  date: Date;
  value: SignedMoney;
}

/**
 * Represents a checking account transaction of a bank account.
 *
 * A `CheckingAccount`:
 * - must have a bank account id.
 * - must have a date.
 * - must have a value.
 *
 * `CheckingAccount` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const CHECKING_ACCOUNT = CheckingAccount.create({
 *   bankAccountId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   date: new Date('2026-01-01T00:00:00.000Z'),
 *   value: SignedMoney.create('-123.45'),
 * })
 *
 * CHECKING_ACCOUNT.value.value.toString()
 * // '-123.45'
 * ```
 */
export class CheckingAccount {
  private readonly _id?: EntityId;
  private readonly props: Required<CheckingAccountProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the checking account.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the id of the bank account the checking account
   * transaction belongs to.
   */
  get bankAccountId(): EntityId {
    return this.props.bankAccountId;
  }

  /**
   * Returns the date of the checking account transaction.
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * Returns the value of the checking account transaction.
   */
  get value(): SignedMoney {
    return this.props.value;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `CheckingAccount`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link CheckingAccount.create} and therefore
   * satisfy the checking account's invariants.
   */
  private constructor(props: Required<CheckingAccountProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `CheckingAccount` from the provided properties.
   *
   * @param props - The properties required to create the checking
   *   account.
   * @param id - The unique identifier of the checking account.
   *
   * @returns A valid `CheckingAccount` instance.
   *
   * @throws {ValidationError} If `props.bankAccountId` is blank.
   * @throws {ValidationError} If `props.date` is missing.
   * @throws {ValidationError} If `props.value` is missing.
   */
  public static create(
    props: CheckingAccountProps,
    id?: string,
  ): CheckingAccount {
    if (!props.bankAccountId || props.bankAccountId.trim() === "") {
      throw new ValidationError("CheckingAccount must have a bank account id.");
    }
    if (!props.date) {
      throw new ValidationError("CheckingAccount must have a date.");
    }
    if (!props.value) {
      throw new ValidationError("CheckingAccount must have a value.");
    }

    const NORMALIZED_PROPS: Required<CheckingAccountProps> = {
      ...props,
    };

    return new CheckingAccount(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `CheckingAccount` represents the same
   * checking account as the provided instance, based on referential
   * equality and the unique id.
   *
   * @param object - The checking account to compare against.
   * @returns `true` when both checking accounts share the same id;
   * otherwise, `false`.
   */
  public equals(object?: CheckingAccount | null): boolean {
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
