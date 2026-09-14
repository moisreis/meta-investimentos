import { EntityId, type QuotaQuantity } from "@/value-objects";
import { ValidationError } from "@/errors";

interface TransactionAllocationProps {
  applicationId: EntityId;
  withdrawId: EntityId;
  quotasConsumed: QuotaQuantity;
  createdAt?: Date;
}

/**
 * @summary
 * Represents allocation of quotas from application to withdrawal.
 *
 * @remarks
 * Must have applicationId, withdrawId, quotasConsumed.
 * Instances are immutable after creation.
 *
 * @explanation
 * Tracks FIFO allocation of quotas for tax purposes.
 * Links applications to withdrawals.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class TransactionAllocation {
  private readonly _id?: EntityId;
  private readonly props: Required<TransactionAllocationProps>;

  /**
   * @summary
   * Returns the unique identifier of the transaction allocation.
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
   * Returns the application ID of the allocation.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to trace allocation source.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get applicationId(): EntityId {
    return this.props.applicationId;
  }

  /**
   * @summary
   * Returns the withdrawal ID of the allocation.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to trace allocation destination.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get withdrawId(): EntityId {
    return this.props.withdrawId;
  }

  /**
   * @summary
   * Returns the quotas consumed by the allocation.
   *
   * @remarks
   * Valid QuotaQuantity.
   *
   * @explanation
   * Use for tax lot tracking.
   *
   * @returns QuotaQuantity.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get quotasConsumed(): QuotaQuantity {
    return this.props.quotasConsumed;
  }

  /**
   * @summary
   * Returns the creation timestamp of the allocation.
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
   * Creates a TransactionAllocation instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use TransactionAllocation.create instead.
   *
   * @param props - Required allocation properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(
    props: Required<TransactionAllocationProps>,
    id?: string,
  ) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * @summary
   * Creates a valid TransactionAllocation from provided properties.
   *
   * @remarks
   * Validates applicationId, withdrawId, quotasConsumed.
   * createdAt defaults to current time.
   *
   * @explanation
   * Factory method to construct a valid TransactionAllocation.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the allocation.
   * @param id - Optional unique identifier.
   *
   * @returns Valid TransactionAllocation instance.
   *
   * @example
   * const ALLOCATION = TransactionAllocation.create({
   *   applicationId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   *   withdrawId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
   *   quotasConsumed: QuotaQuantity.create("6.123"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: TransactionAllocationProps,
    id?: string,
  ): TransactionAllocation {
    if (!props.applicationId || props.applicationId.trim() === "") {
      throw new ValidationError(
        "`TransactionAllocation` must have an application id.",
      );
    }
    if (!props.withdrawId || props.withdrawId.trim() === "") {
      throw new ValidationError(
        "`TransactionAllocation` must have a withdrawal id.",
      );
    }
    if (!props.quotasConsumed) {
      throw new ValidationError(
        "`TransactionAllocation` must have consumed quotas.",
      );
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<TransactionAllocationProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    };

    return new TransactionAllocation(NORMALIZED_PROPS, id);
  }

  /**
   * @summary
   * Compares this TransactionAllocation with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The TransactionAllocation to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = TransactionAllocation.create(PROPS, ID);
   * const B = TransactionAllocation.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: TransactionAllocation | null): boolean {
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
