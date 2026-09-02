import type { Fund } from "@/business/entities/fund/fund.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `Fund` entities.
 *
 * An `IFund`:
 * - persists funds through {@link IFund.save}.
 * - retrieves funds by id and cnpj.
 * - removes funds by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Fund` entities and back.
 */
export interface IFund {
  /**
   * Retrieves the fund with the provided id.
   *
   * @param id - The unique identifier of the fund.
   * @returns A promise resolving to the `Fund` or `null` when
   * not found.
   */
  findById(id: EntityId): Promise<Fund | null>;

  /**
   * Retrieves the fund with the provided cnpj.
   *
   * @param cnpj - The cnpj of the fund.
   * @returns A promise resolving to the `Fund` or `null` when
   * not found.
   */
  findByCnpj(cnpj: string): Promise<Fund | null>;

  /**
   * Persists the provided fund.
   *
   * When the fund has no id, the implementation inserts a new record
   * and the persisted `Fund` (with its generated id) is returned;
   * otherwise the existing record is updated.
   *
   * @param fund - The fund to persist.
   * @returns A promise resolving to the persisted `Fund`.
   */
  save(fund: Fund): Promise<Fund>;

  /**
   * Removes the fund with the provided id.
   *
   * @param id - The unique identifier of the fund.
   * @returns A promise that resolves when the fund is removed.
   */
  delete(id: EntityId): Promise<void>;
}
