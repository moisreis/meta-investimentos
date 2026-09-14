import {
  EntityId,
  type PositiveMoney,
  type QuotaQuantity,
} from "@/value-objects";
import { ValidationError } from "@/errors";

interface ApplicationProps {
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
 * Represents a fund application made against a position.
 *
 * @remarks
 * Must have positionId, date, amount, quotas.
 * Instances immutable after creation.
 *
 * @explanation
 * Tracks application transactions with reversal support.
 * Links to position for quota tracking.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Application {
  private readonly _id?: EntityId;
  private readonly props: Required<ApplicationProps>;

  /**
   * @summary
   * Returns the unique identifier of the application.
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
   * Returns the position ID of the application.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to associate application with position.
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
   * Returns the date of the application.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Use for time-series queries.
   *
   * @returns Application Date.
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
   * Returns the amount of the application.
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
   * Returns the quotas of the application.
   *
   * @remarks
   * QuotaQuantity value.
   *
   * @explanation
   * Use for position sizing.
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
   * Returns the reversal date of the application, if any.
   *
   * @remarks
   * Nullable Date.
   *
   * @explanation
   * Use to check if application was reversed.
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
   * Returns the user ID who reversed the application, if any.
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
   * Returns the creation timestamp of the application.
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
   * Returns the last update timestamp of the application.
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
   * Creates an Application instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Application.create instead.
   *
   * @param props - Required application properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<ApplicationProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * @summary
   * Creates a valid Application from the provided properties.
   *
   * @remarks
   * Validates positionId, date, amount, quotas.
   * Optional fields default to null; timestamps to now.
   *
   * @explanation
   * Factory method to construct a valid Application.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the application.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Application instance.
   *
   * @example
   * const APPLICATION = Application.create({
   *   positionId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   *   date: new Date("2026-01-01T00:00:00.000Z"),
   *   amount: PositiveMoney.create("1000.00"),
   *   quotas: QuotaQuantity.create("12.345"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: ApplicationProps, id?: string): Application {
    if (!props.positionId || props.positionId.trim() === "") {
      throw new ValidationError("Application must have a position id.");
    }
    if (!props.date) {
      throw new ValidationError("Application must have a date.");
    }
    if (!props.amount) {
      throw new ValidationError("Application must have an amount.")
    }
    if (!props.quotas) {
      throw new ValidationError("Application must have quotas.")
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<ApplicationProps> = {
      ...props,
      reversedAt: props.reversedAt ?? null,
      reversedByUserId: props.reversedByUserId ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    }

    return new Application(NORMALIZED_PROPS, id)
  }

  /**
   * @summary
   * Reverses this application.
   *
   * @remarks
   * Returns new reversed Application instance.
   * Cannot reverse already reversed application.
   *
   * @explanation
   * Use to cancel an application.
   * Records reversal timestamp and user.
   *
   * @param userId - Reversing user EntityId.
   * @param now - Reversal timestamp (optional, defaults to now).
   *
   * @returns New reversed Application instance.
   *
   * @example
   * const REVERSED = application.reverse(EntityId.create("user-id"));
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public reverse(userId: EntityId, now?: Date): Application {
    if (this._id === undefined) {
      throw new ValidationError(
        "Cannot reverse an application that has not been persisted.",
      )
    }
    if (this.props.reversedAt !== null) {
      throw new ValidationError(
        "Cannot reverse an application that is already reversed.",
      )
    }

    const NOW = now ?? new Date()

    return new Application(
      {
        ...this.props,
        reversedAt: NOW,
        reversedByUserId: userId,
        updatedAt: NOW,
      },
      this._id,
    )
  }

  /**
   * @summary
   * Compares this Application with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The Application to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = Application.create(PROPS, ID)
   * const B = Application.create(PROPS, ID)
   * A.equals(B) // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Application | null): boolean {
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
