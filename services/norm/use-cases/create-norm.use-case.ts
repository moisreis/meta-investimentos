import { Norm } from "@domain/norm/entities/norm.entity"
import { INorm } from "@domain/norm/interfaces/norm.interface"
import type { NormResponseDTO } from "../dto/norm-response.dto"
import { toCreateNormProps, toResponseDTO } from "../mappers/norm.mapper"

export interface CreateNormInput {
  articleNumber: string
  name: string
  categoryId: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}

/**
 * @summary
 * Creates a new `Norm` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the norm with the norm repository.
 *
 * @explanation
 * Use this use case to register a new norm through
 * the service layer.
 *
 * @example
 * const NORM = await CREATE_NORM_USE_CASE.execute({
 *   articleNumber: "10.1",
 *   name: "Renda Fixa",
 *   categoryId: "category-1",
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateNormUseCase {
  constructor(private normRepository: INorm) {}

  /**
   * @summary
   * Creates and persists a new norm.
   *
   * @param input - The norm creation payload.
   * @returns The persisted norm response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: CreateNormInput): Promise<NormResponseDTO> {
    const PROPS = toCreateNormProps(input)
    const NORM = Norm.create(PROPS)
    const SAVED = await this.normRepository.save(NORM)
    return toResponseDTO(SAVED)
  }
}