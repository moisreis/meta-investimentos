import { Statement } from "@domain/statement/entities/statement.entity"
import { IStatement } from "@domain/statement/interfaces/statement.interface"
import type { StatementResponseDTO } from "../dto/statement-response.dto"
import {
  toCreateStatementProps,
  toResponseDTO,
} from "../mappers/statement.mapper"

export interface GenerateStatementInput {
  portfolioId?: string | null
  periodStart: string
  periodEnd: string
  generatedByUserId?: string | null
  fileUrl: string
}

/**
 * @summary
 * Generates a `Statement` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper, adds
 * the file url produced downstream, and saves the
 * statement with the statement repository.
 *
 * @explanation
 * Use this use case to register a generated statement
 * through the service layer.
 *
 * @example
 * const STATEMENT = await GENERATE_STATEMENT_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 *   periodStart: "2026-01-01T00:00:00.000Z",
 *   periodEnd: "2026-01-31T00:00:00.000Z",
 *   generatedByUserId: "user-1",
 *   fileUrl: "https://storage.example.com/s1.pdf",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GenerateStatementUseCase {
  constructor(private statementRepository: IStatement) {}

  /**
   * @summary
   * Generates and persists the statement.
   *
   * @remarks
   * Builds entity props through the create mapper, adds
   * the file url produced downstream, and saves the
   * statement with the statement repository.
   *
   * @explanation
   * Use this method to register a generated statement
   * through the service layer.
   *
   * @param input - The statement generation payload.
   *
   * @returns The persisted statement.
   *
   * @example
   * const STATEMENT = await GENERATE_STATEMENT_USE_CASE
   *   .execute({
   *     portfolioId: "portfolio-1",
   *     periodStart: "2026-01-01T00:00:00.000Z",
   *     periodEnd: "2026-01-31T00:00:00.000Z",
   *     generatedByUserId: "user-1",
   *     fileUrl: "https://storage.example.com/s1.pdf",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GenerateStatementInput): Promise<StatementResponseDTO> {
    const PROPS = toCreateStatementProps({
      portfolioId: input.portfolioId,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      generatedByUserId: input.generatedByUserId,
    })
    const STATEMENT = Statement.create({
      ...PROPS,
      fileUrl: input.fileUrl,
    })
    const SAVED = await this.statementRepository.save(STATEMENT)
    return toResponseDTO(SAVED)
  }
}
