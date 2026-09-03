import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { StatementDto } from "./statement.dtos";
import { toStatementDto } from "./statement.dtos";

/**
 * Input for {@link getStatement}.
 */
export interface GetStatementInput {
  /**
   * The id of the statement to retrieve.
   */
  statementId: string;
}

/**
 * Retrieves a single statement by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The statement id.
 * @returns The {@link StatementDto}.
 *
 * @throws {NotFoundError} When the statement does not exist.
 */
export async function getStatement(
  ctx: Pick<UnitOfWorkContext, "statements">,
  input: GetStatementInput,
): Promise<StatementDto> {
  const statement = await ctx.statements.findById(
    EntityId.create(input.statementId),
  );

  if (statement === null) {
    throw new NotFoundError(
      `Statement with id ${input.statementId} was not found.`,
    );
  }

  return toStatementDto(statement);
}
