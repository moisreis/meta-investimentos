import type QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the properties required to create a
 * {@link TransactionAllocation}.
 *
 * The `createdAt` timestamp defaults to the current time when not provided.
 *
 * Use {@link TransactionAllocation.create} to create a valid
 * `TransactionAllocation` instance.
 */
interface TransactionAllocationProps {
  applicationId: string;
  withdrawId: string;
  quotasConsumed: QuotaQuantity;
  createdAt?: Date;
}

/**
 * Represents the allocation of quotas consumed from an application
 * towards a withdrawal.
 *
 * A `TransactionAllocation`:
 * - must have an application id.
 * - must have a withdrawal id.
 * - must have consumed quotas.
 *
 * `TransactionAllocation` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const ALLOCATION = TransactionAllocation.create({
 *   applicationId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   withdrawId: 'f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d',
 *   quotasConsumed: QuotaQuantity.create('6.123'),
 * })
 *
 * ALLOCATION.quotasConsumed.value.toString()
 * // '6.123'
 * ```
 */
export class TransactionAllocation {
  private readonly _id?: string;
  private readonly props: Required<TransactionAllocationProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the transaction allocation.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the id of the application the allocation belongs to.
   */
  get applicationId(): string {
    return this.props.applicationId;
  }

  /**
   * Returns the id of the withdrawal the allocation belongs to.
   */
  get withdrawId(): string {
    return this.props.withdrawId;
  }

  /**
   * Returns the number of quotas consumed by the allocation.
   */
  get quotasConsumed(): QuotaQuantity {
    return this.props.quotasConsumed;
  }

  /**
   * Returns the creation timestamp of the transaction allocation.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `TransactionAllocation`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link TransactionAllocation.create} and therefore
   * satisfy the transaction allocation's invariants.
   */
  private constructor(
    props: Required<TransactionAllocationProps>,
    id?: string,
  ) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `TransactionAllocation` from the provided properties.
   *
   * The `createdAt` timestamp defaults to the current time when not
   * provided.
   *
   * @param props - The properties required to create the transaction
   * allocation.
   * @param id - The unique identifier of the transaction allocation.
   *
   * @returns A valid `TransactionAllocation` instance.
   *
   * @throws {Error} If `props.applicationId` is blank.
   * @throws {Error} If `props.withdrawId` is blank.
   * @throws {Error} If `props.quotasConsumed` is missing.
   */
  public static create(
    props: TransactionAllocationProps,
    id?: string,
  ): TransactionAllocation {
    if (!props.applicationId || props.applicationId.trim() === "") {
      throw new Error("TransactionAllocation must have an application id.");
    }
    if (!props.withdrawId || props.withdrawId.trim() === "") {
      throw new Error("TransactionAllocation must have a withdrawal id.");
    }
    if (!props.quotasConsumed) {
      throw new Error("TransactionAllocation must have consumed quotas.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<TransactionAllocationProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
    };

    return new TransactionAllocation(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `TransactionAllocation` represents the same
   * transaction allocation as the provided instance, based on referential
   * equality and the unique id.
   *
   * @param object - The transaction allocation to compare against.
   * @returns `true` when both transaction allocations share the same id;
   * otherwise, `false`.
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
