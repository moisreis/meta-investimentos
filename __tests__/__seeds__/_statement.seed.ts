import {
  FRESH_STATEMENT,
  OTHER_PORTFOLIO_ID,
  OTHER_STATEMENT,
  OTHER_STATEMENT_ID,
  OTHER_USER_ID,
  PORTFOLIO_ID,
  STATEMENT,
  STATEMENT_ID,
  THIRD_STATEMENT,
  THIRD_STATEMENT_ID,
  UPDATED_STATEMENT,
  USER_ID,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Statement } from "@/business/entities";
import { statement } from "@/infrastructure/database/schemas";
import { seedPortfolioById } from "./_portfolio.seed";
import { seedUserById } from "./_user.seed";

export {
  STATEMENT_ID,
  OTHER_STATEMENT_ID,
  THIRD_STATEMENT_ID,
  STATEMENT,
  OTHER_STATEMENT,
  THIRD_STATEMENT,
  UPDATED_STATEMENT,
  FRESH_STATEMENT,
};

export async function seedStatements(): Promise<Statement[]> {
  await seedStatementParents();

  for (const fixture of [STATEMENT, OTHER_STATEMENT, THIRD_STATEMENT]) {
    await db.insert(statement).values({
      id: fixture.id,
      portfolioId: fixture.portfolioId,
      periodStart: fixture.periodStart.toISOString(),
      periodEnd: fixture.periodEnd.toISOString(),
      fileUrl: fixture.fileUrl,
      generatedByUserId: fixture.generatedByUserId,
      createdAt: fixture.createdAt,
    });
  }

  return [STATEMENT, OTHER_STATEMENT, THIRD_STATEMENT];
}

export async function seedStatementParents(): Promise<void> {
  await seedUserById(USER_ID);
  await seedUserById(OTHER_USER_ID);
  await seedPortfolioById(PORTFOLIO_ID);
  await seedPortfolioById(OTHER_PORTFOLIO_ID);
}
