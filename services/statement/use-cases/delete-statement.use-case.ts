import { IStatement } from "@domain/statement/interfaces/statement.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteStatementInput {
  statementId: string
}

/**
 * @summary
 * Deletes an existing `Statement`.
 *
 * @remarks
 * Hydrates the statement by its id and removes the row.
 * Throws **NotFoundError** when no statement matches.
 *
 * @explanation
 * Use this use case to remove a single statement through
 * the service layer.
 *
 * @example
 * await DELETE_STATEMENT_USE_CASE.execute({
 *   statementId: "statement-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class DeleteStatementUseCase {
  constructor(private statementRepository: IStatement) {}

  /**
   * @summary
   * Removes the statement with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no statement matches.
   *
   * @explanation
   * Use this method to delete a single statement by its
   * primary key through the service layer.
   *
   * @param input - Payload with the target statement id.
   *
   * @returns Resolves when the row is removed.
   *
   * @example
   * await DELETE_STATEMENT_USE_CASE.execute({
   *   statementId: "statement-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(input: DeleteStatementInput): Promise<void> {
    const ID = EntityId.create(input.statementId)
    const STATEMENT = await this.statementRepository.findById(ID)

    if (!STATEMENT) {
      throw new NotFoundError("`Statement` not found.")
    }

    await this.statementRepository.delete(ID)
  }
}
