import {
  EntityId,
  type PositiveMoney,
  type QuotaQuantity,
  type SignedMoney,
  type SignedPercentage,
} from "@/value-objects"
import { ValidationError } from "@/errors"

export interface PortfolioPerformanceProps {
  portfolioId: EntityId
  date: Date
  quotasHeld: QuotaQuantity
  patrimony: PositiveMoney
  applicationTotal: PositiveMoney
  redemptionTotal: PositiveMoney
  cashFlowNet: SignedMoney
  earnings: SignedMoney
  returnDaily: SignedPercentage
  returnMonthly?: SignedPercentage | null
  returnYearly?: SignedPercentage | null
  returnLast12m?: SignedPercentage | null
  target?: SignedPercentage | null
  cumulativeTarget?: SignedPercentage | null
  inflationSpread?: SignedPercentage | null
  riskFreeSpread?: SignedPercentage | null
  marketSpread?: SignedPercentage | null
  createdAt?: Date
}

/**
 * @summary
 * Represents the performance of a portfolio on a given date.
 *
 * @remarks
 * Must have portfolioId, date, quotasHeld, patrimony,
 * totals, cashFlowNet, earnings, returnDaily.
 * Instances immutable after creation.
 *
 * @explanation
 * Stores daily performance snapshot for a portfolio.
 * Includes returns, targets, and benchmark spreads.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class PortfolioPerformance {
  private readonly _id?: EntityId
  private readonly props: Required<PortfolioPerformanceProps>

  // ---------------------------------
  // PROPERTIES
  // ---------------------------------

  /**
   * @summary
   * Returns the unique identifier of the portfolio performance.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Provides the stable identity used by the repository
   * and by `equals` to compare snapshots.
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
   * Returns the portfolio ID of the performance.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Identifies the portfolio being measured on that day.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get portfolioId(): EntityId {
    return this.props.portfolioId
  }

  /**
   * @summary
   * Returns the date of the performance.
   *
   * @remarks
   * Required Date.
   *
   * @explanation
   * Fixes the trading day this snapshot refers to.
   *
   * @returns Performance Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get date(): Date {
    return new Date(this.props.date)
  }

  /**
   * @summary
   * Returns the total quotas held by the portfolio.
   *
   * @remarks
   * QuotaQuantity value.
   *
   * @explanation
   * Defines the total quota count on the snapshot date.
   *
   * @returns QuotaQuantity.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get quotasHeld(): QuotaQuantity {
    return this.props.quotasHeld
  }

  /**
   * @summary
   * Returns the patrimony of the portfolio.
   *
   * @remarks
   * PositiveMoney value.
   *
   * @explanation
   * Net asset value of the portfolio on that date.
   *
   * @returns PositiveMoney.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get patrimony(): PositiveMoney {
    return this.props.patrimony
  }

  /**
   * @summary
   * Returns the application total of the portfolio.
   *
   * @remarks
   * PositiveMoney value.
   *
   * @explanation
   * Cumulative applications up to the snapshot date.
   *
   * @returns PositiveMoney.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get applicationTotal(): PositiveMoney {
    return this.props.applicationTotal
  }

  /**
   * @summary
   * Returns the redemption total of the portfolio.
   *
   * @remarks
   * PositiveMoney value.
   *
   * @explanation
   * Cumulative redemptions up to the snapshot date.
   *
   * @returns PositiveMoney.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get redemptionTotal(): PositiveMoney {
    return this.props.redemptionTotal
  }

  /**
   * @summary
   * Returns the net cash flow of the portfolio.
   *
   * @remarks
   * SignedMoney value.
   *
   * @explanation
   * Net applications minus redemptions so far.
   *
   * @returns SignedMoney.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get cashFlowNet(): SignedMoney {
    return this.props.cashFlowNet
  }

  /**
   * @summary
   * Returns the earnings of the portfolio.
   *
   * @remarks
   * SignedMoney value.
   *
   * @explanation
   * Cumulative earnings of the portfolio to date.
   *
   * @returns SignedMoney.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get earnings(): SignedMoney {
    return this.props.earnings
  }

  /**
   * @summary
   * Returns the daily return of the portfolio.
   *
   * @remarks
   * SignedPercentage value.
   *
   * @explanation
   * Single-day return of the portfolio.
   *
   * @returns SignedPercentage.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get returnDaily(): SignedPercentage {
    return this.props.returnDaily
  }

  /**
   * @summary
   * Returns the monthly return of the portfolio.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Rolling monthly return of the portfolio.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get returnMonthly(): SignedPercentage | null {
    return this.props.returnMonthly
  }

  /**
   * @summary
   * Returns the yearly return of the portfolio.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Rolling yearly return of the portfolio.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get returnYearly(): SignedPercentage | null {
    return this.props.returnYearly
  }

  /**
   * @summary
   * Returns the return of the portfolio over the last 12 months.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Use for trailing 12-month performance.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get returnLast12m(): SignedPercentage | null {
    return this.props.returnLast12m
  }

  /**
   * @summary
   * Returns the target of the portfolio.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Portfolio target return for the period.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get target(): SignedPercentage | null {
    return this.props.target
  }

  /**
   * @summary
   * Returns the cumulative target of the portfolio.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Accumulated target return to date.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get cumulativeTarget(): SignedPercentage | null {
    return this.props.cumulativeTarget
  }

  /**
   * @summary
   * Returns the inflation spread of the portfolio.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Spread of performance over the inflation index.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get inflationSpread(): SignedPercentage | null {
    return this.props.inflationSpread
  }

  /**
   * @summary
   * Returns the risk-free spread of the portfolio.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Spread of performance over **CDI**.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get riskFreeSpread(): SignedPercentage | null {
    return this.props.riskFreeSpread
  }

  /**
   * @summary
   * Returns the market spread of the portfolio.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Spread of performance over **Ibovespa**.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get marketSpread(): SignedPercentage | null {
    return this.props.marketSpread
  }

  /**
   * @summary
   * Returns the creation timestamp of the portfolio performance.
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
   * Creates a PortfolioPerformance instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use PortfolioPerformance.create instead.
   *
   * @param props - Required performance properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<PortfolioPerformanceProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      date: new Date(props.date),
      createdAt: new Date(props.createdAt),
    })
  }

  // ---------------------------------
  // FACTORY
  // ---------------------------------

  /**
   * @summary
   * Creates a valid PortfolioPerformance from the props.
   *
   * @remarks
   * Validates required fields. Optional fields
   * default to null. createdAt defaults to current time.
   *
   * @explanation
   * Factory method to construct a valid PortfolioPerformance.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties for the performance.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Portfolio snapshot.
   *
   * @example
   * const PERF = PortfolioPerformance.create({
   *   portfolioId: EntityId.create(
   *     "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"
   *   ),
   *   date: new Date("2026-01-01"),
   *   quotasHeld: QuotaQuantity.create("1000"),
   *   patrimony: PositiveMoney.create("50000"),
   *   applicationTotal: PositiveMoney.create("10000"),
   *   redemptionTotal: PositiveMoney.create("5000"),
   *   cashFlowNet: SignedMoney.create("5000"),
   *   earnings: SignedMoney.create("1000"),
   *   returnDaily: SignedPercentage.create("0.5"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(
    props: PortfolioPerformanceProps,
    id?: string
  ): PortfolioPerformance {
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new ValidationError(
        "`PortfolioPerformance` must have a portfolio id."
      )
    }
    if (!props.date) {
      throw new ValidationError("`PortfolioPerformance` must have a date.")
    }
    if (!props.quotasHeld) {
      throw new ValidationError("`PortfolioPerformance` must have quotas held.")
    }
    if (!props.patrimony) {
      throw new ValidationError("`PortfolioPerformance` must have patrimony.")
    }
    if (!props.applicationTotal) {
      throw new ValidationError(
        "`PortfolioPerformance` must have an application total."
      )
    }
    if (!props.redemptionTotal) {
      throw new ValidationError(
        "`PortfolioPerformance` must have a redemption total."
      )
    }
    if (!props.cashFlowNet) {
      throw new ValidationError(
        "`PortfolioPerformance` must have cash flow net."
      )
    }
    if (!props.earnings) {
      throw new ValidationError("`PortfolioPerformance` must have earnings.")
    }
    if (!props.returnDaily) {
      throw new ValidationError(
        "`PortfolioPerformance` must have a daily return."
      )
    }

    const NOW = new Date()

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
    }

    return new PortfolioPerformance(NORMALIZED_PROPS, id)
  }

  // ---------------------------------
  // COMPARISON
  // ---------------------------------

  /**
   * @summary
   * Compares this performance with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Compares two snapshots by their persisted identity.
   *
   * @param object - The PortfolioPerformance to compare against.
   *
   * @returns True when both IDs match.
   *
   * @example
   * const A = PortfolioPerformance.create(PROPS, ID);
   * const B = PortfolioPerformance.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: PortfolioPerformance | null): boolean {
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
