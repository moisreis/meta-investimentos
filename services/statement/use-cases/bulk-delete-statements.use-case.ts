import { IStatement } from "@domain/statement/interfaces/statement.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteStatementsInput {
  statementIds: string[]
}

/**
 * @summary
 * Deletes multiple `Statement` records.
 *
 * @remarks
 * Hydrates each statement by its id and removes the rows
 * that still exist. Rows that no longer exist are silently
 * skipped. The repository contract exposes single-row
 * deletes, so each removal runs through `delete(id)`.
 *
 * @explanation
 * Use this use case to remove many statements of the
 * registry through the service layer.
 *
 * @example
 * await BULK_DELETE_STATEMENTS_USE_CASE.execute({
 *   statementIds: ["statement-1", "statement-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class BulkDeleteStatementsUseCase {
  constructor(private statementRepository: IStatement) {}

  /**
   * @summary
   * Removes the statements with the provided ids.
   *
   * @remarks
   * Skips ids without a matching row. Returns early when
   * the list is empty.
   *
   * @explanation
   * Use this method to delete the selected statement rows
   * of the registry in a single flow.
   *
   * @param input - Payload with the target statement ids.
   *
   * @returns Resolves when the rows are removed.
   *
   * @example
   * await BULK_DELETE_STATEMENTS_USE_CASE.execute({
   *   statementIds: ["statement-1", "statement-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: BulkDeleteStatementsInput
  ): Promise<void> {
    if (input.statementIds.length === 0) {
      return
    }

    for (const id of input.statementIds) {
      const ENTITY_ID = EntityId.create(id)
      const STATEMENT =
        await this.statementRepository.findById(ENTITY_ID)

      if (STATEMENT) {
        await this.statementRepository.delete(ENTITY_ID)
      }
    }
  }
}
