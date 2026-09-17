import { INorm } from "@domain/norm/interfaces/norm.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { NormResponseDTO } from "../dto/norm-response.dto"
import { toResponseDTO } from "../mappers/norm.mapper"

export interface GetNormInput {
  normId: string
}

/**
 * @summary
 * Retrieves an existing `Norm` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no norm matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single norm through
 * the service layer.
 *
 * @example
 * const NORM = await GET_NORM_USE_CASE.execute({
 *   normId: "norm-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetNormUseCase {
  constructor(private normRepository: INorm) {}

  /**
   * @summary
   * Fetches the norm with the provided id.
   *
   * @param input - Payload with the target norm id.
   * @returns The matching norm response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GetNormInput): Promise<NormResponseDTO> {
    const ID = EntityId.create(input.normId)
    const NORM = await this.normRepository.findById(ID)
    if (!NORM) {
      throw new NotFoundError("`Norm` not found.")
    }
    return toResponseDTO(NORM)
  }
}