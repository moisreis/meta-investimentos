import type { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `NormsPortfolios` relations.
 *
 * An `INormsPortfolios`:
 * - persists relations through {@link INormsPortfolios.save}.
 * - retrieves relations by norm id and portfolio id.
 * - removes relations by the composite key of norm id and portfolio id.
 *
 * The `NormsPortfolios` relation has no id column, so lookups and
 * mutations are keyed on the composite `(normId, portfolioId)` pair.
 *
 * Implementations are responsible for mapping database rows to
 * `NormsPortfolios` entities and back.
 */
export interface INormsPortfolios {
  /**
   * Retrieves the relation between the provided norm id and portfolio id.
   *
   * @param normId - The unique identifier of the norm.
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise resolving to the `NormsPortfolios` or `null` when
   * not found.
   */
  findByNormIdAndPortfolioId(
    normId: EntityId,
    portfolioId: EntityId,
  ): Promise<NormsPortfolios | null>;

  /**
   * Retrieves all relations belonging to the provided portfolio id.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise resolving to the `NormsPortfolios` entries or an
   * empty array when there are no matches.
   */
  findAllByPortfolioId(portfolioId: EntityId): Promise<NormsPortfolios[]>;

  /**
   * Retrieves all relations belonging to the provided norm id.
   *
   * @param normId - The unique identifier of the norm.
   * @returns A promise resolving to the `NormsPortfolios` entries or an
   * empty array when there are no matches.
   */
  findAllByNormId(normId: EntityId): Promise<NormsPortfolios[]>;

  /**
   * Persists the provided norms-portfolios relation.
   *
   * The relation is keyed on the composite `(normId, portfolioId)` pair;
   * the implementation inserts or updates the matching record.
   *
   * @param normsPortfolios - The relation to persist.
   * @returns A promise resolving to the persisted `NormsPortfolios`.
   */
  save(normsPortfolios: NormsPortfolios): Promise<NormsPortfolios>;

  /**
   * Removes the relation between the provided norm id and portfolio id.
   *
   * @param normId - The unique identifier of the norm.
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise that resolves when the relation is removed.
   */
  delete(normId: EntityId, portfolioId: EntityId): Promise<void>;
}
