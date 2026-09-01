import { db } from "@/__tests__/__setup__/_database.setup";
import { Statement } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { statement } from "@/infrastructure/database/schemas";
import {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  seedPortfolioById,
} from "./_portfolio.seed";
import { OTHER_USER_ID, seedUserById, USER_ID } from "./_user.seed";

export const STATEMENT_ID = "25e6f708-1a2b-4c0d-9e1f-2a3b4c5d6e7f";
export const OTHER_STATEMENT_ID = "36f70819-2b3c-4d1e-8f2a-3b4c5d6e7f80";
export const THIRD_STATEMENT_ID = "4708192a-3c4d-4e2f-9a3b-4c5d6e7f8091";

export const STATEMENT = Statement.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    periodStart: new Date("2026-01-01T00:00:00.000Z"),
    periodEnd: new Date("2026-01-31T00:00:00.000Z"),
    fileUrl: "https://example.com/statements/fia-january.pdf",
    generatedByUserId: EntityId.create(USER_ID),
  },
  STATEMENT_ID,
);

export const OTHER_STATEMENT = Statement.create(
  {
    portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
    periodStart: new Date("2026-02-01T00:00:00.000Z"),
    periodEnd: new Date("2026-02-28T00:00:00.000Z"),
    fileUrl: "https://example.com/statements/rf-february.pdf",
    generatedByUserId: EntityId.create(USER_ID),
  },
  OTHER_STATEMENT_ID,
);

export const THIRD_STATEMENT = Statement.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    periodStart: new Date("2026-03-01T00:00:00.000Z"),
    periodEnd: new Date("2026-03-31T00:00:00.000Z"),
    fileUrl: "https://example.com/statements/fia-march.pdf",
    generatedByUserId: EntityId.create(OTHER_USER_ID),
  },
  THIRD_STATEMENT_ID,
);

export const UPDATED_STATEMENT = Statement.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    periodStart: STATEMENT.periodStart,
    periodEnd: STATEMENT.periodEnd,
    fileUrl: "https://example.com/statements/fia-january-v2.pdf",
    generatedByUserId: EntityId.create(USER_ID),
  },
  STATEMENT_ID,
);

export const FRESH_STATEMENT = Statement.create({
  portfolioId: EntityId.create(PORTFOLIO_ID),
  periodStart: new Date("2026-04-01T00:00:00.000Z"),
  periodEnd: new Date("2026-04-30T00:00:00.000Z"),
  fileUrl: "https://example.com/statements/fia-april.pdf",
  generatedByUserId: EntityId.create(USER_ID),
});

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
