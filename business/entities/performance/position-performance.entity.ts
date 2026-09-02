import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import type { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import type { SignedMoney } from "@/business/value-objects/signed-money.vo";
import type { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a
 * {@link PositionPerformance}.
 *
 * The optional return and timestamp fields default to `null` and the
 * current time respectively when not provided.
 *
 * Use {@link PositionPerformance.create} to create a valid
 * `PositionPerformance` instance.
 */
interface PositionPerformanceProps {
  positionId: EntityId;
  date: Date;
  quotasHeld: QuotaQuantity;
  patrimony: PositiveMoney;
  applicationTotal: PositiveMoney;
  redemptionTotal: PositiveMoney;
  cashFlowNet: SignedMoney;
  earnings: SignedMoney;
  returnDaily: SignedPercentage;
  returnMonthly?: SignedPercentage | null;
  returnYearly?: SignedPercentage | null;
  returnLast12m?: SignedPercentage | null;
  allocation: SignedPercentage;
  createdAt?: Date;
}

/**
 * Represents the performance of a position on a given date.
 *
 * A `PositionPerformance`:
 * - must have a position id.
 * - must have a date.
 * - must have quotas held.
 * - must have patrimony.
 * - must have an application total.
 * - must have a redemption total.
 * - must have cash flow net.
 * - must have earnings.
 * - must have a daily return.
 * - must have an allocation.
 *
 * `PositionPerformance` instances are immutable after creation.
 */
export class PositionPerformance {
  private readonly _id?: EntityId;
  private readonly props: Required<PositionPerformanceProps>;

  /**
   * Returns the unique identifier of the position performance.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the id of the position the performance belongs to.
   */
  get positionId(): EntityId {
    return this.props.positionId;
  }

  /**
   * Returns the date of the performance.
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * Returns the total quotas held by the position.
   */
  get quotasHeld(): QuotaQuantity {
    return this.props.quotasHeld;
  }

  /**
   * Returns the patrimony of the position.
   */
  get patrimony(): PositiveMoney {
    return this.props.patrimony;
  }

  /**
   * Returns the application total of the position.
   */
  get applicationTotal(): PositiveMoney {
    return this.props.applicationTotal;
  }

  /**
   * Returns the redemption total of the position.
   */
  get redemptionTotal(): PositiveMoney {
    return this.props.redemptionTotal;
  }

  /**
   * Returns the net cash flow of the position.
   */
  get cashFlowNet(): SignedMoney {
    return this.props.cashFlowNet;
  }

  /**
   * Returns the earnings of the position.
   */
  get earnings(): SignedMoney {
    return this.props.earnings;
  }

  /**
   * Returns the daily return of the position.
   */
  get returnDaily(): SignedPercentage {
    return this.props.returnDaily;
  }

  /**
   * Returns the monthly return of the position.
   */
  get returnMonthly(): SignedPercentage | null {
    return this.props.returnMonthly;
  }

  /**
   * Returns the yearly return of the position.
   */
  get returnYearly(): SignedPercentage | null {
    return this.props.returnYearly;
  }

  /**
   * Returns the return of the position over the last 12 months.
   */
  get returnLast12m(): SignedPercentage | null {
    return this.props.returnLast12m;
  }

  /**
   * Returns the allocation of the position.
   */
  get allocation(): SignedPercentage {
    return this.props.allocation;
  }

  /**
   * Returns the creation timestamp of the position performance.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Creates a `PositionPerformance`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link PositionPerformance.create} and therefore
   * satisfy the position performance's invariants.
   */
  private constructor(props: Required<PositionPerformanceProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `PositionPerformance` from the provided properties.
   *
   * The optional return and timestamp fields default to `null` and the
   * current time respectively when those properties are not provided.
   *
   * @param props - The properties required to create the position performance.
   * @param id - The unique identifier of the position performance.
   *
   * @returns A valid `PositionPerformance` instance.
   *
   * @throws {ValidationError} If `props.positionId` is blank.
   * @throws {ValidationError} If `props.date` is not provided.
   * @throws {ValidationError} If `props.quotasHeld` is not provided.
   * @throws {ValidationError} If `props.patrimony` is not provided.
   * @throws {ValidationError} If `props.applicationTotal` is not provided.
   * @throws {ValidationError} If `props.redemptionTotal` is not provided.
   * @throws {ValidationError} If `props.cashFlowNet` is not provided.
   * @throws {ValidationError} If `props.earnings` is not provided.
   * @throws {ValidationError} If `props.returnDaily` is not provided.
   * @throws {ValidationError} If `props.allocation` is not provided.
   */
  public static create(
    props: PositionPerformanceProps,
    id?: string,
  ): PositionPerformance {
    if (!props.positionId || props.positionId.trim() === "") {
      throw new ValidationError("PositionPerformance must have a position id.");
    }
    if (!props.date) {
      throw new ValidationError("PositionPerformance must have a date.");
    }
    if (!props.quotasHeld) {
      throw new ValidationError("PositionPerformance must have quotas held.");
    }
    if (!props.patrimony) {
      throw new ValidationError("PositionPerformance must have patrimony.");
    }
    if (!props.applicationTotal) {
      throw new ValidationError(
        "PositionPerformance must have an application total.",
      );
    }
    if (!props.redemptionTotal) {
      throw new ValidationError(
        "PositionPerformance must have a redemption total.",
      );
    }
    if (!props.cashFlowNet) {
      throw new ValidationError("PositionPerformance must have cash flow net.");
    }
    if (!props.earnings) {
      throw new ValidationError("PositionPerformance must have earnings.");
    }
    if (!props.returnDaily) {
      throw new ValidationError(
        "PositionPerformance must have a daily return.",
      );
    }
    if (!props.allocation) {
      throw new ValidationError("PositionPerformance must have an allocation.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<PositionPerformanceProps> = {
      ...props,
      returnMonthly: props.returnMonthly ?? null,
      returnYearly: props.returnYearly ?? null,
      returnLast12m: props.returnLast12m ?? null,
      createdAt: props.createdAt ?? NOW,
    };

    return new PositionPerformance(NORMALIZED_PROPS, id);
  }

  /**
   * Determines whether this `PositionPerformance` represents the same
   * position performance as the provided instance, based on referential
   * equality and the unique id.
   *
   * @param object - The position performance to compare against.
   * @returns `true` when both share the same id; otherwise, `false`.
   */
  public equals(object?: PositionPerformance | null): boolean {
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
