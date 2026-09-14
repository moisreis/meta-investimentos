import { EntityId } from "@/value-objects";
import { ValidationError } from "@/errors";

interface BankProps {
  code: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @summary
 * Represents a financial institution.
 *
 * @remarks
 * Must have code and name. Instances immutable after creation.
 *
 * @explanation
 * Stores bank information for accounts and funds.
 * Supports renaming and code changes.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Bank {
  private readonly _id?: EntityId;
  private readonly props: Required<BankProps>;

  /**
   * @summary
   * Returns the unique identifier of the bank.
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
   * Returns the code of the bank.
   *
   * @remarks
   * Required string (e.g., "001").
   *
   * @explanation
   * Use for bank identification in transactions.
   *
   * @returns Code string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get code(): string {
    return this.props.code;
  }

  /**
   * @summary
   * Returns the name of the bank.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Use for display and identification.
   *
   * @returns Name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * @summary
   * Returns the creation timestamp of the bank.
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
   * Returns the last update timestamp of the bank.
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
   * Creates a Bank instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Bank.create instead.
   *
   * @param props - Required bank properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<BankProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * @summary
   * Creates a valid Bank from the provided properties.
   *
   * @remarks
   * Validates code and name. Timestamps default to current time.
   *
   * @explanation
   * Factory method to construct a valid Bank.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the bank.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Bank instance.
   *
   * @example
   * const BANK = Bank.create({
   *   code: "001",
   *   name: "Banco do Brasil",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: BankProps, id?: string): Bank {
    if (!props.code || props.code.trim() === "") {
      throw new ValidationError("Bank must have a code.");
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("Bank must have a name.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<BankProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Bank(NORMALIZED_PROPS, id);
  }

  /**
   * @summary
   * Renames this bank.
   *
   * @remarks
   * Returns new Bank instance with updated name.
   *
   * @explanation
   * Use to change bank name.
   * Original instance unchanged.
   *
   * @param name - New bank name.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns New Bank instance with updated name.
   *
   * @example
   * const RENAMED = bank.rename("Banco do Brasil S.A.");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public rename(name: string, now?: Date): Bank {
    if (!name || name.trim() === "") {
      throw new ValidationError("Bank must have a name.");
    }

    const NOW = now ?? new Date();

    return new Bank(
      {
        ...this.props,
        name,
        updatedAt: NOW,
      },
      this._id,
    );
  }

  /**
   * @summary
   * Changes the code of this bank.
   *
   * @remarks
   * Returns new Bank instance with updated code.
   *
   * @explanation
   * Use to change bank code.
   * Original instance unchanged.
   *
   * @param code - New bank code.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns New Bank instance with updated code.
   *
   * @example
   * const RECODED = bank.changeCode("002");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public changeCode(code: string, now?: Date): Bank {
    if (!code || code.trim() === "") {
      throw new ValidationError("Bank must have a code.");
    }

    const NOW = now ?? new Date();

    return new Bank(
      {
        ...this.props,
        code,
        updatedAt: NOW,
      },
      this._id,
    );
  }

  /**
   * @summary
   * Compares this Bank with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The Bank to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = Bank.create(PROPS, ID);
   * const B = Bank.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Bank | null): boolean {
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
