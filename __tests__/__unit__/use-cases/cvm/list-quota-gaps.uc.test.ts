import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  FUND,
  OTHER_FUND,
} from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Quota } from "@/business/entities/fund/quota.entity";
import { listQuotaGaps } from "@/business/use-cases/cvm/list-quota-gaps.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";

describe("listQuotaGaps", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  it("returns no gaps when every fund has a quota for every date", async () => {
    unitOfWork.seed({
      funds: [FUND, OTHER_FUND],
      quotas: [
        Quota.create({
          fundId: EntityId.create(ID.FUND.DEFAULT),
          date: new Date("2024-01-01"),
          price: QuotaPrice.create("10"),
        }),
        Quota.create({
          fundId: EntityId.create(ID.FUND.OTHER),
          date: new Date("2024-01-01"),
          price: QuotaPrice.create("10"),
        }),
      ],
    });

    const RESULT = await listQuotaGaps(
      {
        findAll: unitOfWork.funds.findAll,
        findAllByFundIdsInPeriod: unitOfWork.quotas.findAllByFundIdsInPeriod,
      },
      new Date("2024-01-01"),
      new Date("2024-01-31"),
    );

    expect(RESULT).toEqual([]);
  });

  it("detects a date where only some funds have data", async () => {
    unitOfWork.seed({
      funds: [FUND, OTHER_FUND],
      quotas: [
        Quota.create({
          fundId: EntityId.create(ID.FUND.DEFAULT),
          date: new Date("2024-01-01"),
          price: QuotaPrice.create("10"),
        }),
      ],
    });

    const RESULT = await listQuotaGaps(
      {
        findAll: unitOfWork.funds.findAll,
        findAllByFundIdsInPeriod: unitOfWork.quotas.findAllByFundIdsInPeriod,
      },
      new Date("2024-01-01"),
      new Date("2024-01-31"),
    );

    expect(RESULT).toHaveLength(1);
    expect(RESULT[0].missingFundCount).toBe(1);
    expect(RESULT[0].missingFundIds).toContain(ID.FUND.OTHER);
    expect(RESULT[0].totalFundCount).toBe(2);
  });

  it("returns an empty array when there are no funds", async () => {
    const RESULT = await listQuotaGaps(
      {
        findAll: unitOfWork.funds.findAll,
        findAllByFundIdsInPeriod: unitOfWork.quotas.findAllByFundIdsInPeriod,
      },
      new Date("2024-01-01"),
      new Date("2024-01-31"),
    );

    expect(RESULT).toEqual([]);
  });

  it("sorts gaps by date ascending", async () => {
    unitOfWork.seed({
      funds: [FUND, OTHER_FUND],
      quotas: [
        Quota.create({
          fundId: EntityId.create(ID.FUND.OTHER),
          date: new Date("2024-01-31"),
          price: QuotaPrice.create("10"),
        }),
        Quota.create({
          fundId: EntityId.create(ID.FUND.DEFAULT),
          date: new Date("2024-01-01"),
          price: QuotaPrice.create("10"),
        }),
      ],
    });

    const RESULT = await listQuotaGaps(
      {
        findAll: unitOfWork.funds.findAll,
        findAllByFundIdsInPeriod: unitOfWork.quotas.findAllByFundIdsInPeriod,
      },
      new Date("2024-01-01"),
      new Date("2024-01-31"),
    );

    expect(RESULT).toHaveLength(2);
    expect(RESULT[0].date.getTime()).toBeLessThan(RESULT[1].date.getTime());
  });
});
