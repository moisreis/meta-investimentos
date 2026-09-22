import type { NormsPortfolios } from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the `NormsPortfolios` repository contract.
 *
 * @remarks
 * An `INormsPortfolios` persists, retrieves, and
 * removes relations.
 * No id column exists, so lookups and mutations use the
 * composite `(normId, portfolioId)` pair.
 *
 * @explanation
 * Use this interface to implement data access for relations.
 * Persistence implementations map rows to `NormsPortfolios`
 * entities.
 *
 * @example
 * const REL = await NP_REPO
 *   .findByNormIdAndPortfolioId(NORM_ID, PF_ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface INormsPortfolios {
  /**
   * @summary
   * Retrieves the relation between the provided ids.
   *
   * @remarks
   * Returns null when no relation matches.
   *
   * @explanation
   * Use this method to look up a single relation by its
   * composite key. Callers check null for existence.
   *
   * @param normId - The unique identifier of the norm.
   * @param portfolioId - The unique identifier of the portfolio.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const REL = await NP_REPO
   *   .findByNormIdAndPortfolioId(NORM_ID, PF_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByNormIdAndPortfolioId(
    normId: EntityId,
    portfolioId: EntityId
  ): Promise<NormsPortfolios | null>

  /**
   * @summary
   * Retrieves all relations of the provided portfolio.
   *
   * @remarks
   * Returns an empty array when no relations match.
   *
   * @explanation
   * Use this method to list relations linked to a
   * portfolio. Returns an empty array for no matches.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   *
   * @returns The matching entries.
   *
   * @example
   * const RELS = await NP_REPO.findAllByPortfolioId(PF_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPortfolioId(portfolioId: EntityId): Promise<NormsPortfolios[]>

  /**
   * @summary
   * Retrieves all relations of the provided portfolios.
   *
   * @remarks
   * Returns an empty array when no relations match.
   *
   * @explanation
   * Use this method to list relations linked to several
   * portfolios. Returns an empty array for no matches.
   *
   * @param portfolioIds - The identifiers of the portfolios.
   *
   * @returns The matching entries.
   *
   * @example
   * const RELS = await NP_REPO
   *   .findAllByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByPortfolioIds(portfolioIds: EntityId[]): Promise<NormsPortfolios[]>

  /**
   * @summary
   * Retrieves all relations of the provided norm.
   *
   * @remarks
   * Returns an empty array when no relations match.
   *
   * @explanation
   * Use this method to list relations linked to a norm.
   * Returns an empty array for no matches.
   *
   * @param normId - The unique identifier of the norm.
   *
   * @returns The matching entries.
   *
   * @example
   * const RELS = await NP_REPO.findAllByNormId(NORM_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByNormId(normId: EntityId): Promise<NormsPortfolios[]>

  /**
   * @summary
   * Persists the provided relation.
   *
   * @remarks
   * Keyed on the composite `(normId, portfolioId)` pair.
   * The implementation inserts or updates the matching row.
   *
   * @explanation
   * Use this method to create or update a relation.
   * The persisted `NormsPortfolios` entity is returned.
   *
   * @param normsPortfolios - The relation to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const REL = await NP_REPO.save(NEW_REL);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(normsPortfolios: NormsPortfolios): Promise<NormsPortfolios>

  /**
   * @summary
   * Removes the relation between the provided ids.
   *
   * @remarks
   * Resolves when the relation is removed.
   *
   * @explanation
   * Use this method to delete a relation by its
   * composite key. It resolves once the operation completes.
   *
   * @param normId - The unique identifier of the norm.
   * @param portfolioId - The unique identifier of the portfolio.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await NP_REPO.delete(NORM_ID, PF_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(normId: EntityId, portfolioId: EntityId): Promise<void>
}
