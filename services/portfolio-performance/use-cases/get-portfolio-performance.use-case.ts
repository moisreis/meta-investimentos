import { EntityId } from "@/value-objects"
import { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import { NotFoundError } from "@errors/not-found.error"
import type { PortfolioPerformanceResponseDTO } from "../dto/portfolio-performance-response.dto"
import { toResponseDTO } from "../mappers/portfolio-performance.mapper"

export interface GetPortfolioPerformanceInput {
  id: string
}

/**
 * @summary
 * Retrieves a single portfolio performance snapshot.
 *
 * @remarks
 * Looks up the performance by its id and maps the entity
 * to the response DTO through the service mapper.
 *
 * @explanation
 * Use this use case to fetch one daily portfolio record
 * from the service layer.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   id: "performance-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetPortfolioPerformanceUseCase {
  constructor(
    private portfolioPerformanceRepository: IPortfolioPerformance
  ) {}

  /**
   * @summary
   * Retrieves and maps the portfolio performance.
   *
   * @remarks
   * Looks up the performance by its id and maps the entity
   * to the response DTO through the service mapper.
   *
   * @explanation
   * Use this method to fetch one daily portfolio record
   * from the service layer.
   *
   * @param input - The performance identifier.
   *
   * @returns The mapped performance.
   *
   * @example
   * const RESULT = await USE_CASE.execute({
   *   id: "performance-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetPortfolioPerformanceInput
  ): Promise<PortfolioPerformanceResponseDTO> {
    const PERFORMANCE =
      await this.portfolioPerformanceRepository.findById(
        EntityId.create(input.id)
      )
    if (!PERFORMANCE) {
      throw new NotFoundError(
        "`PortfolioPerformance` not found."
      )
    }
    return toResponseDTO(PERFORMANCE)
  }
}
