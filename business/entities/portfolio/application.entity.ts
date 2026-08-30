import type PositiveMoney from "@/business/value-objects/positive-money.vo";
import type QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the properties required to create an {@link Application}.
 *
 * The `reversedAt` and `reversedByUserId` fields default to `null`, and the
 * timestamps default to the current time when not provided.
 *
 * Use {@link Application.create} to create a valid `Application` instance.
 */
interface ApplicationProps {
  positionId: string;
  date: Date;
  amount: PositiveMoney;
  quotas: QuotaQuantity;
  reversedAt?: Date | null;
  reversedByUserId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a fund application made against a position.
 *
 * An `Application`:
 * - must have a position id.
 * - must have a date.
 * - must have an amount.
 * - must have quotas.
 *
 * `Application` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const APPLICATION = Application.create({
 *   positionId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   date: new Date('2026-01-01T00:00:00.000Z'),
 *   amount: PositiveMoney.create('1000.00'),
 *   quotas: QuotaQuantity.create('12.345'),
 * })
 *
 * APPLICATION.amount.value.toString()
 * // '1000'
 * ```
 */
export class Application {
  private readonly _id?: string;
  private readonly props: Required<ApplicationProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the application.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the id of the position the application belongs to.
   */
  get positionId(): string {
    return this.props.positionId;
  }

  /**
   * Returns the date of the application.
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * Returns the amount of the application.
   */
  get amount(): PositiveMoney {
    return this.props.amount;
  }

  /**
   * Returns the number of quotas of the application.
   */
  get quotas(): QuotaQuantity {
    return this.props.quotas;
  }

  /**
   * Returns the date the application was reversed, if any.
   */
  get reversedAt(): Date | null {
    return this.props.reversedAt;
  }

  /**
   * Returns the id of the user who reversed the application, if any.
   */
  get reversedByUserId(): string | null {
    return this.props.reversedByUserId;
  }

  /**
   * Returns the creation timestamp of the application.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the application.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates an `Application`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Application.create} and therefore satisfy
   * the application's invariants.
   */
  private constructor(props: Required<ApplicationProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `Application` from the provided properties.
   *
   * The `reversedAt` and `reversedByUserId` fields default to `null`,
   * and the timestamps to the current time when those properties are
   * not provided.
   *
   * @param props - The properties required to create the application.
   * @param id - The unique identifier of the application.
   *
   * @returns A valid `Application` instance.
   *
   * @throws {Error} If `props.positionId` is blank.
   * @throws {Error} If `props.date` is missing.
   * @throws {Error} If `props.amount` is missing.
   * @throws {Error} If `props.quotas` is missing.
   */
  public static create(props: ApplicationProps, id?: string): Application {
    if (!props.positionId || props.positionId.trim() === "") {
      throw new Error("Application must have a position id.");
    }
    if (!props.date) {
      throw new Error("Application must have a date.");
    }
    if (!props.amount) {
      throw new Error("Application must have an amount.");
    }
    if (!props.quotas) {
      throw new Error("Application must have quotas.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<ApplicationProps> = {
      ...props,
      reversedAt: props.reversedAt ?? null,
      reversedByUserId: props.reversedByUserId ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Application(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `Application` represents the same application
   * as the provided instance, based on referential equality and the
   * unique id.
   *
   * @param object - The application to compare against.
   * @returns `true` when both applications share the same id; otherwise,
   * `false`.
   */
  public equals(object?: Application | null): boolean {
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
