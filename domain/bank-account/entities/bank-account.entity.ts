import { EntityId } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface BankAccountProps {
  portfolioId: EntityId
  bankId: EntityId
  agency: string
  accountNumber: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * @summary
 * Represents a bank account belonging to a portfolio.
 *
 * @remarks
 * Must have portfolioId, bankId, agency, accountNumber.
 * Instances immutable after creation.
 *
 * @explanation
 * Links a portfolio to a bank account for cash movements.
 * Supports agency and account number updates.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class BankAccount {
  private readonly _id?: EntityId
  private readonly props: Required<BankAccountProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the bank account.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare bank accounts.
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
   * Returns the portfolio ID of the bank account.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the portfolio that owns this bank account.
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
   * Returns the bank ID of the account.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the bank hosting the account.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get bankId(): EntityId {
    return this.props.bankId
  }

  /**
   * @summary
   * Returns the agency of the bank account.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Groups the account under the bank's agency branch.
   *
   * @returns Agency string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get agency(): string {
    return this.props.agency
  }

  /**
   * @summary
   * Returns the account number of the bank account.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Identifies the account for transfers and cashouts.
   *
   * @returns Account number string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get accountNumber(): string {
    return this.props.accountNumber
  }

  /**
   * @summary
   * Returns the creation timestamp of the bank account.
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
   * Returns the last update timestamp of the bank account.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Shows when the bank account last changed.
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
   * Creates a BankAccount instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use BankAccount.create instead.
   *
   * @param props - Required bank account properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<BankAccountProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid BankAccount from the provided properties.
   *
   * @remarks
   * Validates all fields. Timestamps default to current time.
   *
   * @explanation
   * Factory method to construct a valid BankAccount.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the account.
   * @param id - Optional unique identifier.
   *
   * @returns Valid BankAccount.
   *
   * @example
   * const BANK_ACCOUNT = BankAccount.create({
   *   portfolioId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   *   bankId: EntityId.create(
   *     "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"
   *   ),
   *   agency: "1234",
   *   accountNumber: "56789-0",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: BankAccountProps, id?: string): BankAccount {
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new ValidationError("`BankAccount` must have a portfolio id.")
    }
    if (!props.bankId || props.bankId.trim() === "") {
      throw new ValidationError("`BankAccount` must have a bank id.")
    }
    if (!props.agency || props.agency.trim() === "") {
      throw new ValidationError("`BankAccount` must have an agency.")
    }
    if (!props.accountNumber || props.accountNumber.trim() === "") {
      throw new ValidationError("`BankAccount` must have an account number.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<BankAccountProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new BankAccount(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // MUTATIONS
  // ---------------------------------

  /**
   * @summary
   * Updates the mutable fields of this bank account.
   *
   * @remarks
   * Only provided fields changed.
   *
   * @explanation
   * Returns new BankAccount instance with updated fields.
   * Original unchanged.
   *
   * @param options - Fields to update.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns Updated BankAccount.
   *
   * @example
   * const UPDATED = bankAccount.update({
   *   agency: "5678",
   *   accountNumber: "98765-4",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public update(
    options: {
      agency?: string
      accountNumber?: string
    },
    now?: Date
  ): BankAccount {
    const AGENCY = options.agency ?? this.props.agency
    const ACCOUNT_NUMBER = options.accountNumber ?? this.props.accountNumber

    if (!AGENCY || AGENCY.trim() === "") {
      throw new ValidationError("`BankAccount` must have an agency.")
    }
    if (!ACCOUNT_NUMBER || ACCOUNT_NUMBER.trim() === "") {
      throw new ValidationError("`BankAccount` must have an account number.")
    }

    const NOW = now ?? new Date()

    return new BankAccount(
      {
        ...this.props,
        agency: AGENCY,
        accountNumber: ACCOUNT_NUMBER,
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
   * Compares this BankAccount with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two bank accounts by their persisted identity.
   *
   * @param object - The BankAccount to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = BankAccount.create(PROPS, ID);
   * const B = BankAccount.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: BankAccount | null): boolean {
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
