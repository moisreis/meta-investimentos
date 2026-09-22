import { INorm } from "@domain/norm/interfaces/norm.interface"
import { EntityId } from "@/value-objects"
import type { NormResponseDTO } from "../dto/norm-response.dto"
import { toResponseDTO } from "../mappers/norm.mapper"

export interface ListNormsInput {
  categoryId: string
}

/**
 * @summary
 * Lists all `Norm` entries of a category.
 *
 * @remarks
 * Uses the category id to scope the norm query.
 *
 * @explanation
 * Use this use case to list the norms of a given
 * category through the service layer.
 *
 * @example
 * const NORMS = await LIST_NORMS_USE_CASE.execute({
 *   categoryId: "category-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListNormsUseCase {
  constructor(private normRepository: INorm) {}

  /**
   * @summary
   * Fetches all norms of the provided category.
   *
   * @remarks
   * Uses the category id to scope the norm query.
   *
   * @explanation
   * Use this method to list the norms of a given
   * category through the service layer.
   *
   * @param input - Payload with the target category id.
   *
   * @returns The matching norms.
   *
   * @example
   * const NORMS = await LIST_NORMS_USE_CASE.execute({
   *   categoryId: "category-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: ListNormsInput): Promise<NormResponseDTO[]> {
    const CATEGORY_ID = EntityId.create(input.categoryId)
    const NORMS = await this.normRepository.findAllByCategoryId(CATEGORY_ID)
    return NORMS.map(toResponseDTO)
  }
}
