import { EntityId, type QuotaQuantity } from "@/value-objects"
import { ValidationError } from "@/errors"

export interface TransactionAllocatedProps {
  allocationId: EntityId
  applicationId: EntityId
  withdrawId: EntityId
  quotasConsumed: QuotaQuantity
  occurredAt?: Date
}

/**
 * @summary
 * Records a quota allocation between transactions.
 *
 * @remarks
 * Emitted after the **TransactionAllocation** is persisted.
 * Carries consumed quotas from application to withdrawal.
 *
 * @explanation
 * Use this event to react to **FIFO** quota allocation.
 * It links applications to withdrawals for tax
 * purposes.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-16
 */
export class TransactionAllocated {
  private readonly _id?: EntityId
  private readonly props: Required<TransactionAllocatedProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the recorded allocation.
  get allocationId(): EntityId {
    return this.props.allocationId
  }

  // Returns the identifier of the source application.
  get applicationId(): EntityId {
    return this.props.applicationId
  }

  // Returns the identifier of the destination withdrawal.
  get withdrawId(): EntityId {
    return this.props.withdrawId
  }

  // Returns the quotas consumed by the allocation.
  get quotasConsumed(): QuotaQuantity {
    return this.props.quotasConsumed
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<TransactionAllocatedProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **TransactionAllocated** event.
   *
   * @remarks
   * Validates the required fields and value objects.
   * The occurred date defaults to the current time.
   *
   * @explanation
   * Factory method to build the event after the
   * **TransactionAllocation** is stored. Throws a
   * **ValidationError** when a required field is missing.
   *
   * @param props - Properties of the allocated transaction.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = TransactionAllocated.create({
   *   allocationId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   applicationId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   withdrawId: EntityId.create(
   *     "423e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   quotasConsumed: QuotaQuantity.create("6.123"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-16
   */
  public static create(
    props: TransactionAllocatedProps,
    id?: string
  ): TransactionAllocated {
    if (!props.allocationId) {
      throw new ValidationError(
        "`TransactionAllocated` must have an allocation id."
      )
    }
    if (!props.applicationId) {
      throw new ValidationError(
        "`TransactionAllocated` must have an application id."
      )
    }
    if (!props.withdrawId) {
      throw new ValidationError(
        "`TransactionAllocated` must have a withdrawal id."
      )
    }
    if (!props.quotasConsumed) {
      throw new ValidationError(
        "`TransactionAllocated` must have consumed quotas."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<TransactionAllocatedProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new TransactionAllocated(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: TransactionAllocated | null): boolean {
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
