import { Quota } from "@/business/entities/fund/quota.entity";
import type { IQuota } from "@/business/interfaces/fund/quota.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import QuotaPrice from "@/business/value-objects/quota-price.vo";

export const FUND_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const QUOTA_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const QUOTA_ID_TWO = "c1c2c3c4-c5c6-4c7c-8c9c-0c1c2c3c4c5c";
export const QUOTA_ID_THREE = "d1d2d3d4-d5d6-4d7d-8d9d-0d1d2d3d4d5d";

export const QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: new Date("2024-01-15T12:00:00.000Z"),
    price: QuotaPrice.create("10.50"),
  },
  QUOTA_ID,
);

export const EARLIER_QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: new Date("2024-01-01T12:00:00.000Z"),
    price: QuotaPrice.create("10.00"),
  },
  QUOTA_ID_TWO,
);

export const LATEST_QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: new Date("2024-01-31T12:00:00.000Z"),
    price: QuotaPrice.create("11.00"),
  },
  QUOTA_ID_THREE,
);

export function createInMemoryQuotaRepository(): IQuota {
  const ROWS = new Map<string, Quota>();

  return {
    async findById(id: string): Promise<Quota | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByFundId(fundId: string): Promise<Quota[]> {
      const MATCHES: Quota[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.fundId === fundId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async findByFundIdAndDate(
      fundId: string,
      date: Date,
    ): Promise<Quota | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.fundId === fundId && ROW.date.getTime() === date.getTime()) {
          return ROW;
        }
      }

      return null;
    },

    async findLatestByFundId(fundId: string): Promise<Quota | null> {
      let LATEST: Quota | null = null;

      for (const ROW of ROWS.values()) {
        if (ROW.fundId !== fundId) continue;

        if (LATEST === null || ROW.date.getTime() > LATEST.date.getTime()) {
          LATEST = ROW;
        }
      }

      return LATEST;
    },

    async save(quota: Quota): Promise<Quota> {
      ROWS.set(quota.id ?? "generated-id", quota);

      return quota;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
