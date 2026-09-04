import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";

import { recalculatePortfolioPerformance } from "./recalculate-portfolio-performance.uc";

/**
 * The common input shared by every recalculation trigger.
 *
 * The actor id is honored so the recalculation runs complete with the
 * same audit attribution as the mutation that triggered them.
 */
interface RecalculatePerformanceTriggerInput {
  /**
   * The id of the authenticated actor triggering the recalculation.
   */
  actorId: string;

  /**
   * The start date (inclusive) of the period to recompute.
   */
  startDate: Date;

  /**
   * The end date (inclusive) of the period to recompute.
   */
  endDate: Date;
}

/**
 * Input for {@link recalculatePerformanceForPortfolios}.
 */
export interface RecalculatePortfoliosTriggerInput
  extends RecalculatePerformanceTriggerInput {
  /**
   * The ids of the portfolios to recalculate.
   */
  portfolioIds: string[];
}

/**
 * Input for {@link recalculatePerformanceForFunds}.
 */
export interface RecalculateFundsTriggerInput
  extends RecalculatePerformanceTriggerInput {
  /**
   * The ids of the funds whose holding portfolios should be recalculated.
   */
  fundIds: string[];
}

/**
 * Input for {@link recalculatePerformanceForAllPortfolios}.
 */
export interface RecalculateAllPortfoliosTriggerInput
  extends RecalculatePerformanceTriggerInput {}

/**
 * Recalculates the performance of the provided portfolios over the given
 * period.
 *
 * The recalculation runs inside its own `UnitOfWork` transaction, after
 * the mutation that triggered it has already committed, and is attributed
 * to the triggering actor on the audit log.
 */
export async function recalculatePerformanceForPortfolios(
  unitOfWork: UnitOfWork,
  input: RecalculatePortfoliosTriggerInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      if (input.portfolioIds.length === 0) {
        return;
      }

      await recalculatePortfolioPerformance(tx, {
        portfolioIds: input.portfolioIds,
        startDate: input.startDate,
        endDate: input.endDate,
      });
    },
    { userId: EntityId.create(input.actorId) },
  );
}

/**
 * Recalculates the performance of every portfolio holding any of the
 * provided funds over the given period.
 *
 * The affected portfolios are resolved by finding all positions for the
 * funds and deduplicating their owning portfolios, mirroring how CVM
 * imports propagate to the affected portfolios.
 */
export async function recalculatePerformanceForFunds(
  unitOfWork: UnitOfWork,
  input: RecalculateFundsTriggerInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      if (input.fundIds.length === 0) {
        return;
      }

      const positions = await tx.positions.findAllByFundIds(input.fundIds);

      const portfolioIds = [
        ...new Set(positions.map((position) => position.portfolioId as string)),
      ];

      if (portfolioIds.length === 0) {
        return;
      }

      await recalculatePortfolioPerformance(tx, {
        portfolioIds,
        startDate: input.startDate,
        endDate: input.endDate,
      });
    },
    { userId: EntityId.create(input.actorId) },
  );
}

/**
 * Recalculates the performance of every portfolio over the given period.
 *
 * Benchmarks influence every portfolio's targets and spreads, so a
 * benchmark history correction propagates to all portfolios.
 */
export async function recalculatePerformanceForAllPortfolios(
  unitOfWork: UnitOfWork,
  input: RecalculateAllPortfoliosTriggerInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      const portfolios = await tx.portfolios.findAll();

      const portfolioIds = portfolios.map(
        (portfolio) => portfolio.id as string,
      );

      if (portfolioIds.length === 0) {
        return;
      }

      await recalculatePortfolioPerformance(tx, {
        portfolioIds,
        startDate: input.startDate,
        endDate: input.endDate,
      });
    },
    { userId: EntityId.create(input.actorId) },
  );
}
