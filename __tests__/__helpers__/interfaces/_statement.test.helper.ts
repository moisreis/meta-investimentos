import { Statement } from "@/business/entities/report/statement.entity";
import type { IStatement } from "@/business/interfaces/report/statement.interface";

export const STATEMENT_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const PORTFOLIO_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const USER_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";
export const PERIOD_START = new Date("2026-07-01T00:00:00.000Z");
export const PERIOD_END = new Date("2026-07-31T00:00:00.000Z");

export const STATEMENT = Statement.create(
  {
    portfolioId: PORTFOLIO_ID,
    periodStart: PERIOD_START,
    periodEnd: PERIOD_END,
    fileUrl: "https://example.com/statements/july.pdf",
    generatedByUserId: USER_ID,
  },
  STATEMENT_ID,
);

export function createInMemoryStatementRepository(): IStatement {
  const ROWS = new Map<string, Statement>();

  return {
    async findById(id: string): Promise<Statement | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByPortfolioId(portfolioId: string): Promise<Statement[]> {
      const RESULT: Statement[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.portfolioId === portfolioId) RESULT.push(ROW);
      }

      return RESULT;
    },

    async findAllByGeneratedByUserId(userId: string): Promise<Statement[]> {
      const RESULT: Statement[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.generatedByUserId === userId) RESULT.push(ROW);
      }

      return RESULT;
    },

    async save(statement: Statement): Promise<Statement> {
      ROWS.set(statement.id ?? "generated-id", statement);

      return statement;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
