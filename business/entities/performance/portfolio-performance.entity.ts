import type PositiveMoney from "@/business/value-objects/positive-money.vo";
import type QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import type SignedMoney from "@/business/value-objects/signed-money.vo";
import type SignedPercentage from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the properties required to create a
 * {@link PortfolioPerformance}.
 *
 * The optional return, target, spread, and timestamp fields default to
 * `null` and the current time respectively when not provided.
 *
 * Use {@link PortfolioPerformance.create} to create a valid
 * `PortfolioPerformance` instance.
 */
interface PortfolioPerformanceProps {
  portfolioId: string;
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
  target?: SignedPercentage | null;
  cumulativeTarget?: SignedPercentage | null;
  inflationSpread?: SignedPercentage | null;
  riskFreeSpread?: SignedPercentage | null;
  marketSpread?: SignedPercentage | null;
  createdAt?: Date;
}

/**
 * Represents the performance of a portfolio on a given date.
 *
 * A `PortfolioPerformance`:
 * - must have a portfolio id.
 * - must have a date.
 * - must have quotas held.
 * - must have patrimony.
 * - must have an application total.
 * - must have a redemption total.
 * - must have cash flow net.
 * - must have earnings.
 * - must have a daily return.
 *
 * `PortfolioPerformance` instances are immutable after creation.
 */
export class PortfolioPerformance {
  private readonly _id?: string;
  private readonly props: Required<PortfolioPerformanceProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the portfolio performance.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the id of the portfolio the performance belongs to.
   */
  get portfolioId(): string {
    return this.props.portfolioId;
  }

  /**
   * Returns the date of the performance.
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * Returns the total quotas held by the portfolio.
   */
  get quotasHeld(): QuotaQuantity {
    return this.props.quotasHeld;
  }

  /**
   * Returns the patrimony of the portfolio.
   */
  get patrimony(): PositiveMoney {
    return this.props.patrimony;
  }

  /**
   * Returns the application total of the portfolio.
   */
  get applicationTotal(): PositiveMoney {
    return this.props.applicationTotal;
  }

  /**
   * Returns the redemption total of the portfolio.
   */
  get redemptionTotal(): PositiveMoney {
    return this.props.redemptionTotal;
  }

  /**
   * Returns the net cash flow of the portfolio.
   */
  get cashFlowNet(): SignedMoney {
    return this.props.cashFlowNet;
  }

  /**
   * Returns the earnings of the portfolio.
   */
  get earnings(): SignedMoney {
    return this.props.earnings;
  }

  /**
   * Returns the daily return of the portfolio.
   */
  get returnDaily(): SignedPercentage {
    return this.props.returnDaily;
  }

  /**
   * Returns the monthly return of the portfolio.
   */
  get returnMonthly(): SignedPercentage | null {
    return this.props.returnMonthly;
  }

  /**
   * Returns the yearly return of the portfolio.
   */
  get returnYearly(): SignedPercentage | null {
    return this.props.returnYearly;
  }

  /**
   * Returns the return of the portfolio over the last 12 months.
   */
  get returnLast12m(): SignedPercentage | null {
    return this.props.returnLast12m;
  }

  /**
   * Returns the target of the portfolio.
   */
  get target(): SignedPercentage | null {
    return this.props.target;
  }

  /**
   * Returns the cumulative target of the portfolio.
   */
  get cumulativeTarget(): SignedPercentage | null {
    return this.props.cumulativeTarget;
  }

  /**
   * Returns the inflation spread of the portfolio.
   */
  get inflationSpread(): SignedPercentage | null {
    return this.props.inflationSpread;
  }

  /**
   * Returns the risk-free spread of the portfolio.
   */
  get riskFreeSpread(): SignedPercentage | null {
    return this.props.riskFreeSpread;
  }

  /**
   * Returns the market spread of the portfolio.
   */
  get marketSpread(): SignedPercentage | null {
    return this.props.marketSpread;
  }

  /**
   * Returns the creation timestamp of the portfolio performance.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `PortfolioPerformance`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link PortfolioPerformance.create} and therefore
   * satisfy the portfolio performance's invariants.
   */
  private constructor(props: Required<PortfolioPerformanceProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `PortfolioPerformance` from the provided properties.
   *
   * The optional return, target, spread, and timestamp fields default to
   * `null` and the current time respectively when those properties are
   * not provided.
   *
   * @param props - The properties required to create the portfolio performance.
   * @param id - The unique identifier of the portfolio performance.
   *
   * @returns A valid `PortfolioPerformance` instance.
   *
   * @throws {Error} If `props.portfolioId` is blank.
   * @throws {Error} If `props.date` is not provided.
   * @throws {Error} If `props.quotasHeld` is not provided.
   * @throws {Error} If `props.patrimony` is not provided.
   * @throws {Error} If `props.applicationTotal` is not provided.
   * @throws {Error} If `props.redemptionTotal` is not provided.
   * @throws {Error} If `props.cashFlowNet` is not provided.
   * @throws {Error} If `props.earnings` is not provided.
   * @throws {Error} If `props.returnDaily` is not provided.
   */
  public static create(
    props: PortfolioPerformanceProps,
    id?: string,
  ): PortfolioPerformance {
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new Error("PortfolioPerformance must have a portfolio id.");
    }
    if (!props.date) {
      throw new Error("PortfolioPerformance must have a date.");
    }
    if (!props.quotasHeld) {
      throw new Error("PortfolioPerformance must have quotas held.");
    }
    if (!props.patrimony) {
      throw new Error("PortfolioPerformance must have patrimony.");
    }
    if (!props.applicationTotal) {
      throw new Error("PortfolioPerformance must have an application total.");
    }
    if (!props.redemptionTotal) {
      throw new Error("PortfolioPerformance must have a redemption total.");
    }
    if (!props.cashFlowNet) {
      throw new Error("PortfolioPerformance must have cash flow net.");
    }
    if (!props.earnings) {
      throw new Error("PortfolioPerformance must have earnings.");
    }
    if (!props.returnDaily) {
      throw new Error("PortfolioPerformance must have a daily return.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<PortfolioPerformanceProps> = {
      ...props,
      returnMonthly: props.returnMonthly ?? null,
      returnYearly: props.returnYearly ?? null,
      returnLast12m: props.returnLast12m ?? null,
      target: props.target ?? null,
      cumulativeTarget: props.cumulativeTarget ?? null,
      inflationSpread: props.inflationSpread ?? null,
      riskFreeSpread: props.riskFreeSpread ?? null,
      marketSpread: props.marketSpread ?? null,
      createdAt: props.createdAt ?? NOW,
    };

    return new PortfolioPerformance(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `PortfolioPerformance` represents the same
   * portfolio performance as the provided instance, based on referential
   * equality and the unique id.
   *
   * @param object - The portfolio performance to compare against.
   * @returns `true` when both share the same id; otherwise, `false`.
   */
  public equals(object?: PortfolioPerformance | null): boolean {
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
