import { EntityId, type QuotaQuantity } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface TransactionAllocationProps {
  applicationId: EntityId
  withdrawId: EntityId
  quotasConsumed: QuotaQuantity
  version?: number
  createdAt?: Date
}

/**
 * @summary
 * Represents a quota allocation from application to withdrawal.
 *
 * @remarks
 * Must have applicationId, withdrawId, quotasConsumed.
 * Instances are immutable after creation.
 *
 * @explanation
 * Tracks **FIFO** allocation of quotas for tax purposes.
 * Links applications to withdrawals.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class TransactionAllocation {
  private readonly _id?: EntityId
  private readonly props: Required<TransactionAllocationProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the transaction allocation.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare allocations.
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
   * Returns the application ID of the allocation.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the application providing the quotas.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get applicationId(): EntityId {
    return this.props.applicationId
  }

  /**
   * @summary
   * Returns the withdrawal ID of the allocation.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the withdrawal consuming the quotas.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get withdrawId(): EntityId {
    return this.props.withdrawId
  }

  /**
   * @summary
   * Returns the quotas consumed by the allocation.
   *
   * @remarks
   * Valid QuotaQuantity.
   *
   * @explanation
   * Number of quotas drawn from the application lot.
   *
   * @returns QuotaQuantity.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get quotasConsumed(): QuotaQuantity {
    return this.props.quotasConsumed
  }

  /**
   * @summary
   * Returns the optimistic-locking version of the allocation.
   *
   * @remarks
   * Required number, defaults to zero.
   *
   * @explanation
   * Guards concurrent updates in the repository.
   *
   * @returns Current version number.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  get version(): number {
    return this.props.version
  }

  /**
   * @summary
   * Returns the creation timestamp of the allocation.
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

  // ---------------------------------
  // CONSTRUCTION
  // ---------------------------------

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
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      createdAt: new Date(props.createdAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid TransactionAllocation from props.
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
   * @returns Valid quota allocation.
   *
   * @example
   * const ALLOCATION = TransactionAllocation.create({
   *   applicationId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   *   withdrawId: EntityId.create(
   *     "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"
   *   ),
   *   quotasConsumed: QuotaQuantity.create("6.123"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: TransactionAllocationProps,
    id?: string
  ): TransactionAllocation {
    if (!props.applicationId || props.applicationId.trim() === "") {
      throw new ValidationError(
        "`TransactionAllocation` must have an application id."
      )
    }
    if (!props.withdrawId || props.withdrawId.trim() === "") {
      throw new ValidationError(
        "`TransactionAllocation` must have a withdrawal id."
      )
    }
    if (!props.quotasConsumed) {
      throw new ValidationError(
        "`TransactionAllocation` must have consumed quotas."
      )
    }

    const NOW = new Date()

    const NORMALIZED_PROPS: Required<TransactionAllocationProps> = {
      ...props,
      version: props.version ?? 0,
      createdAt: props.createdAt ?? NOW,
    }

    return new TransactionAllocation(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this allocation with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two allocations by their persisted identity.
   *
   * @param object - The allocation to compare against.
   *
   * @returns True when both IDs match.
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
