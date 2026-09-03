import { Statement } from "@/business/entities/report/statement.entity";
import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";

import type { StatementDto } from "./statement.dtos";
import { toStatementDto } from "./statement.dtos";

/**
 * Input for {@link createStatement}.
 */
export interface CreateStatementInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio the statement belongs to, if scoped.
   */
  portfolioId?: string | null;

  /**
   * The start date of the statement period.
   */
  periodStart: Date;

  /**
   * The end date of the statement period.
   */
  periodEnd: Date;

  /**
   * The url of the generated statement file.
   */
  fileUrl: string;
}

/**
 * Creates a statement.
 *
 * The statement is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically. When scoped to a
 * portfolio, the actor must have access to it.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The statement properties.
 * @returns The created {@link StatementDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function createStatement(
  unitOfWork: UnitOfWork,
  input: CreateStatementInput,
): Promise<StatementDto> {
  return unitOfWork.run(
    async (tx) => {
      let portfolioId: EntityId | null = null;

      if (input.portfolioId != null) {
        portfolioId = EntityId.create(input.portfolioId);
        await resolvePortfolioAccess(
          tx,
          portfolioId,
          EntityId.create(input.actorId),
        );
      }

      const statement = Statement.create({
        portfolioId,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        fileUrl: input.fileUrl,
        generatedByUserId: EntityId.create(input.actorId),
      });

      const saved = await tx.statements.save(statement);

      return toStatementDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
