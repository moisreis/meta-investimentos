import { INorm } from "@domain/norm/interfaces/norm.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { NormResponseDTO } from "../dto/norm-response.dto"
import { toResponseDTO } from "../mappers/norm.mapper"

export interface UpdateNormInput {
  normId: string
  articleNumber?: string
  name?: string
  categoryId?: string
  minAllocation?: string
  maxAllocation?: string
  targetAllocation?: string
}

/**
 * @summary
 * Updates an existing `Norm`.
 *
 * @remarks
 * Fetches the norm, applies `update` with the provided
 * fields, and persists the updated entity.
 *
 * @explanation
 * Use this use case to edit the editable fields of an
 * existing norm through the service layer.
 *
 * @example
 * const NORM = await UPDATE_NORM_USE_CASE.execute({
 *   normId: "norm-1",
 *   name: "Renda Variável",
 *   targetAllocation: "15",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdateNormUseCase {
  constructor(private normRepository: INorm) {}

  /**
   * @summary
   * Updates and persists a norm.
   *
   * @param input - Payload with the target norm id and
   *                field updates.
   * @returns The updated norm response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: UpdateNormInput): Promise<NormResponseDTO> {
    const ID = EntityId.create(input.normId)
    const NORM = await this.normRepository.findById(ID)
    if (!NORM) {
      throw new NotFoundError("`Norm` not found.")
    }
    const UPDATED = NORM.update({
      articleNumber: input.articleNumber,
      name: input.name,
      categoryId: input.categoryId
        ? EntityId.create(input.categoryId)
        : undefined,
      minAllocation: input.minAllocation
        ? SignedPercentage.create(input.minAllocation)
        : undefined,
      maxAllocation: input.maxAllocation
        ? SignedPercentage.create(input.maxAllocation)
        : undefined,
      targetAllocation: input.targetAllocation
        ? SignedPercentage.create(input.targetAllocation)
        : undefined,
    })
    const SAVED = await this.normRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}