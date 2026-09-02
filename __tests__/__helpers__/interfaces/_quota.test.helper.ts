import {
  EXTERNAL_QUOTA,
  EXTERNAL_QUOTA_ID,
  FEBRUARY_QUOTA_DATE,
  FRESH_QUOTA,
  FUND_ID,
  OTHER_FUND_ID,
  OTHER_QUOTA,
  OTHER_QUOTA_ID,
  PERIOD_OUTSIDE_QUOTA,
  PERIOD_OUTSIDE_QUOTA_ID,
  QUOTA,
  QUOTA_DATE,
  QUOTA_DUPLICATE_DATE,
  QUOTA_ID,
  UPDATED_QUOTA,
} from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Quota } from "@/business/entities/fund/quota.entity";
import type { IQuota } from "@/business/interfaces/fund/quota.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";

export {
  QUOTA_ID,
  OTHER_QUOTA_ID,
  EXTERNAL_QUOTA_ID,
  PERIOD_OUTSIDE_QUOTA_ID,
  FUND_ID,
  OTHER_FUND_ID,
  QUOTA_DATE,
  QUOTA_DUPLICATE_DATE,
  FEBRUARY_QUOTA_DATE,
  QUOTA,
  OTHER_QUOTA,
  EXTERNAL_QUOTA,
  PERIOD_OUTSIDE_QUOTA,
  UPDATED_QUOTA,
  FRESH_QUOTA,
};

const QUOTA_ID_TWO = "c1c2c3c4-c5c6-4c7c-8c9c-0c1c2c3c4c5c";
const QUOTA_ID_THREE = "d1d2d3d4-d5d6-4d7d-8d9d-0d1d2d3d4d5d";

export const EARLIER_QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: new Date("2026-01-01T12:00:00.000Z"),
    price: QuotaPrice.create("10.00"),
  },
  QUOTA_ID_TWO,
);

export const LATEST_QUOTA = Quota.create(
  {
    fundId: EntityId.create(FUND_ID),
    date: new Date("2026-01-31T12:00:00.000Z"),
    price: QuotaPrice.create("11.00"),
  },
  QUOTA_ID_THREE,
);

export function createInMemoryQuotaRepository(): IQuota {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IQuota["save"]>>>({
    extractId: (q) => q.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByFundId(fundId) {
      return BASE.match((q) => q.fundId === fundId);
    },
    async findByFundIdAndDate(fundId, date) {
      return BASE.findOne(
        (q) => q.fundId === fundId && q.date.getTime() === date.getTime(),
      );
    },
    async findLatestByFundId(fundId) {
      const FOUND = BASE.match((q) => q.fundId === fundId);

      if (FOUND.length === 0) return null;

      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    save: (quota) => BASE.save(quota),
    delete: (id) => BASE.delete(id),
  };
}
