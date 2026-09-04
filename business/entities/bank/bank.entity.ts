import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link Bank}.
 *
 * The timestamps default to the current time when not provided.
 *
 * Use {@link Bank.create} to create a valid `Bank` instance.
 */
interface BankProps {
  code: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a financial institution.
 *
 * A `Bank`:
 * - must have a code.
 * - must have a name.
 *
 * `Bank` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const BANK = Bank.create({
 *   code: '001',
 *   name: 'Banco do Brasil',
 * })
 *
 * BANK.code
 * // '001'
 * ```
 */
export class Bank {
  private readonly _id?: EntityId;
  private readonly props: Required<BankProps>;

  /**
   * Returns the unique identifier of the bank.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the code of the bank.
   */
  get code(): string {
    return this.props.code;
  }

  /**
   * Returns the name of the bank.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Returns the creation timestamp of the bank.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the bank.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Creates a `Bank`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Bank.create} and therefore satisfy the
   * bank's invariants.
   */
  private constructor(props: Required<BankProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `Bank` from the provided properties.
   *
   * The timestamps default to the current time when not provided.
   *
   * @param props - The properties required to create the bank.
   * @param id - The unique identifier of the bank.
   *
   * @returns A valid `Bank` instance.
   *
   * @throws {ValidationError} If `props.code` is blank.
   * @throws {ValidationError} If `props.name` is blank.
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
   * Renames this bank.
   *
   * The code returns a new `Bank` instance with the updated name, leaving
   * the original instance unchanged.
   *
   * @param name - The new name of the bank.
   * @param now - The update timestamp, defaulting to the current time.
   *
   * @returns A new `Bank` instance with the updated name.
   *
   * @throws {ValidationError} If `name` is blank.
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
   * Changes the code of this bank.
   *
   * The code returns a new `Bank` instance with the updated code, leaving
   * the original instance unchanged.
   *
   * @param code - The new code of the bank.
   * @param now - The update timestamp, defaulting to the current time.
   *
   * @returns A new `Bank` instance with the updated code.
   *
   * @throws {ValidationError} If `code` is blank.
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
   * Determines whether this `Bank` represents the same bank as the
   * provided instance, based on referential equality and the unique id.
   *
   * @param object - The bank to compare against.
   * @returns `true` when both banks share the same id; otherwise, `false`.
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
