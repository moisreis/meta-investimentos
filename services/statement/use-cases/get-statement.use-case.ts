import { IStatement } from "@domain/statement/interfaces/statement.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { StatementResponseDTO } from "../dto/statement-response.dto"
import { toResponseDTO } from "../mappers/statement.mapper"

export interface GetStatementInput {
  statementId: string
}

/**
 * @summary
 * Retrieves an existing `Statement` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no statement matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single statement through
 * the service layer.
 *
 * @example
 * const STATEMENT = await GET_STATEMENT_USE_CASE.execute({
 *   statementId: "statement-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetStatementUseCase {
  constructor(private statementRepository: IStatement) {}

  /**
   * @summary
   * Fetches the statement with the provided id.
   *
   * @param input - Payload with the target statement id.
   * @returns The matching statement response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GetStatementInput): Promise<StatementResponseDTO> {
    const ID = EntityId.create(input.statementId)
    const STATEMENT = await this.statementRepository.findById(ID)
    if (!STATEMENT) {
      throw new NotFoundError("`Statement` not found.")
    }
    return toResponseDTO(STATEMENT)
  }
}