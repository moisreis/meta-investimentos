import type { EntityId } from "@/business/value-objects/entity-id.vo";

import { DomainEvent } from "../domain-event";

/**
 * Represents the event that records a change of a portfolio's annual
 * interest rate.
 *
 * The event carries the id of the portfolio whose rate changed. The
 * code records this event when a {@link Portfolio} has its annual
 * interest rate updated.
 *
 * `PortfolioAnnualInterestRateUpdated` instances are immutable after
 * creation.
 */
export class PortfolioAnnualInterestRateUpdated extends DomainEvent {
  /**
   * The id of the portfolio whose rate was updated, or `undefined` when
   * the portfolio has not been persisted yet.
   */
  readonly portfolioId: EntityId | undefined;

  /**
   * Creates a `PortfolioAnnualInterestRateUpdated` event.
   *
   * @param portfolioId - The id of the portfolio, or `undefined` when
   * the portfolio has not been persisted yet.
   * @param occurredAt - The instant the rate changed.
   */
  constructor(
    portfolioId: EntityId | undefined,
    occurredAt: Date = new Date(),
  ) {
    super(occurredAt);
    this.portfolioId = portfolioId;
  }
}
