import { Portfolio } from "@domain/portfolio/entities/portfolio.entity"
import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import type { PortfolioResponseDTO } from "../dto/portfolio-response.dto"
import {
  toCreatePortfolioProps,
  toResponseDTO,
} from "../mappers/portfolio.mapper"

export interface CreatePortfolioInput {
  acronym: string
  name: string
  userId: string
  annualInterestRate: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}

/**
 * @summary
 * Creates a new `Portfolio` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the portfolio with the portfolio repository.
 *
 * @explanation
 * Use this use case to register a new portfolio through
 * the service layer.
 *
 * @example
 * const PORTFOLIO = await CREATE_PORTFOLIO_USE_CASE.execute({
 *   acronym: "ME",
 *   name: "Meu Portfolio",
 *   userId: "user-1",
 *   annualInterestRate: "12.0",
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreatePortfolioUseCase {
  constructor(private portfolioRepository: IPortfolio) {}

  /**
   * @summary
   * Creates and persists a new portfolio.
   *
   * @remarks
   * Builds entity props through the create mapper and
   * saves the portfolio with the portfolio repository.
   *
   * @explanation
   * Use this method to register a new portfolio through
   * the service layer.
   *
   * @param input - The portfolio creation payload.
   *
   * @returns The persisted portfolio.
   *
   * @example
   * const PORTFOLIO = await CREATE_PORTFOLIO_USE_CASE.execute({
   *   acronym: "ME",
   *   name: "Meu Portfolio",
   *   userId: "user-1",
   *   annualInterestRate: "12.0",
   *   minAllocation: "5",
   *   maxAllocation: "20",
   *   targetAllocation: "12",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: CreatePortfolioInput): Promise<PortfolioResponseDTO> {
    const PROPS = toCreatePortfolioProps(input)
    const PORTFOLIO = Portfolio.create(PROPS)
    const SAVED = await this.portfolioRepository.save(PORTFOLIO)
    return toResponseDTO(SAVED)
  }
}
