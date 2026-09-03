import type { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `PortfolioPermission` entities.
 *
 * An `IPortfolioPermission`:
 * - persists permissions through {@link IPortfolioPermission.save}.
 * - retrieves permissions by id, user id, portfolio id, and the
 *   composite (userId, portfolioId) pair.
 * - removes permissions by id and by the composite pair.
 *
 * Implementations are responsible for mapping database rows to
 * `PortfolioPermission` entities and back.
 */
export interface IPortfolioPermission {
  /**
   * Retrieves the permission with the provided id.
   *
   * @param id - The unique identifier of the permission.
   * @returns A promise resolving to the `PortfolioPermission` or
   *   `null` when not found.
   */
  findById(id: EntityId): Promise<PortfolioPermission | null>;

  /**
   * Retrieves the permission for the provided user on the provided
   * portfolio.
   *
   * @param userId - The unique identifier of the user.
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise resolving to the `PortfolioPermission` or
   *   `null` when not found.
   */
  findByUserIdAndPortfolioId(
    userId: EntityId,
    portfolioId: EntityId,
  ): Promise<PortfolioPermission | null>;

  /**
   * Retrieves all permissions belonging to the provided user id.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise resolving to the `PortfolioPermission` entries
   *   or an empty array when there are no matches.
   */
  findAllByUserId(userId: EntityId): Promise<PortfolioPermission[]>;

  /**
   * Retrieves all permissions belonging to the provided portfolio id.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise resolving to the `PortfolioPermission` entries
   *   or an empty array when there are no matches.
   */
  findAllByPortfolioId(portfolioId: EntityId): Promise<PortfolioPermission[]>;

  /**
   * Persists the provided permission.
   *
   * When the permission has no id, the implementation inserts a new
   * record and the persisted `PortfolioPermission` (with its
   * generated id) is returned; otherwise the existing record is
   * updated.
   *
   * @param permission - The permission to persist.
   * @returns A promise resolving to the persisted
   *   `PortfolioPermission`.
   */
  save(permission: PortfolioPermission): Promise<PortfolioPermission>;

  /**
   * Removes the permission with the provided id.
   *
   * @param id - The unique identifier of the permission.
   * @returns A promise that resolves when the permission is removed.
   */
  delete(id: EntityId): Promise<void>;

  /**
   * Removes the permission for the provided user on the provided
   * portfolio.
   *
   * @param userId - The unique identifier of the user.
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise that resolves when the permission is removed.
   */
  deleteByUserIdAndPortfolioId(
    userId: EntityId,
    portfolioId: EntityId,
  ): Promise<void>;
}
