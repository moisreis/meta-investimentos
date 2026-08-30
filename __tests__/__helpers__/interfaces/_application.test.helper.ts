import { Application } from "@/business/entities/portfolio/application.entity";
import type { IApplication } from "@/business/interfaces/portfolio/application.interface";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

export const APPLICATION_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const POSITION_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const OTHER_POSITION_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";
export const APPLICATION_DATE = new Date("2026-01-15T00:00:00.000Z");

export const APPLICATION = Application.create(
  {
    positionId: POSITION_ID,
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
  },
  APPLICATION_ID,
);

export function createInMemoryApplicationRepository(): IApplication {
  const ROWS = new Map<string, Application>();

  return {
    async findById(id: string): Promise<Application | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByPositionId(positionId: string): Promise<Application[]> {
      const MATCHES: Application[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.positionId === positionId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async findAllByPositionIdInPeriod(
      positionId: string,
      startDate: Date,
      endDate: Date,
    ): Promise<Application[]> {
      const MATCHES: Application[] = [];

      for (const ROW of ROWS.values()) {
        if (
          ROW.positionId === positionId &&
          ROW.date.getTime() >= startDate.getTime() &&
          ROW.date.getTime() <= endDate.getTime()
        ) {
          MATCHES.push(ROW);
        }
      }

      return MATCHES;
    },

    async save(application: Application): Promise<Application> {
      ROWS.set(application.id ?? "generated-id", application);

      return application;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
