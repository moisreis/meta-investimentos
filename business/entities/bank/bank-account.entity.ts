import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link BankAccount}.
 *
 * The timestamps default to the current time when not provided.
 *
 * Use {@link BankAccount.create} to create a valid `BankAccount`
 * instance.
 */
interface BankAccountProps {
  portfolioId: EntityId;
  bankId: EntityId;
  agency: string;
  accountNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a bank account belonging to a portfolio.
 *
 * A `BankAccount`:
 * - must have a portfolio id.
 * - must have a bank id.
 * - must have an agency.
 * - must have an account number.
 *
 * `BankAccount` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const BANK_ACCOUNT = BankAccount.create({
 *   portfolioId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   bankId: 'f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d',
 *   agency: '1234',
 *   accountNumber: '56789-0',
 * })
 *
 * BANK_ACCOUNT.agency
 * // '1234'
 * ```
 */
export class BankAccount {
  private readonly _id?: EntityId;
  private readonly props: Required<BankAccountProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the bank account.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the id of the portfolio the bank account belongs to.
   */
  get portfolioId(): EntityId {
    return this.props.portfolioId;
  }

  /**
   * Returns the id of the bank the account belongs to.
   */
  get bankId(): EntityId {
    return this.props.bankId;
  }

  /**
   * Returns the agency of the bank account.
   */
  get agency(): string {
    return this.props.agency;
  }

  /**
   * Returns the account number of the bank account.
   */
  get accountNumber(): string {
    return this.props.accountNumber;
  }

  /**
   * Returns the creation timestamp of the bank account.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the bank account.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `BankAccount`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link BankAccount.create} and therefore satisfy
   * the bank account's invariants.
   */
  private constructor(props: Required<BankAccountProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `BankAccount` from the provided properties.
   *
   * The timestamps default to the current time when not provided.
   *
   * @param props - The properties required to create the bank account.
   * @param id - The unique identifier of the bank account.
   *
   * @returns A valid `BankAccount` instance.
   *
   * @throws {ValidationError} If `props.portfolioId` is blank.
   * @throws {ValidationError} If `props.bankId` is blank.
   * @throws {ValidationError} If `props.agency` is blank.
   * @throws {ValidationError} If `props.accountNumber` is blank.
   */
  public static create(props: BankAccountProps, id?: string): BankAccount {
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new ValidationError("BankAccount must have a portfolio id.");
    }
    if (!props.bankId || props.bankId.trim() === "") {
      throw new ValidationError("BankAccount must have a bank id.");
    }
    if (!props.agency || props.agency.trim() === "") {
      throw new ValidationError("BankAccount must have an agency.");
    }
    if (!props.accountNumber || props.accountNumber.trim() === "") {
      throw new ValidationError("BankAccount must have an account number.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<BankAccountProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new BankAccount(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `BankAccount` represents the same bank
   * account as the provided instance, based on referential equality
   * and the unique id.
   *
   * @param object - The bank account to compare against.
   * @returns `true` when both bank accounts share the same id;
   * otherwise, `false`.
   */
  public equals(object?: BankAccount | null): boolean {
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
