import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  FUND,
  OTHER_FUND,
} from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Quota } from "@/business/entities/fund/quota.entity";
import { listFundStaleness } from "@/business/use-cases/cvm/list-fund-staleness.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";

describe("listFundStaleness", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  it("lists funds sorted by staleness, most stale first", async () => {
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
          date: new Date("2024-01-10"),
          price: QuotaPrice.create("10"),
        }),
      ],
    });

    const RESULT = await listFundStaleness(
      {
        findAll: unitOfWork.funds.findAll,
        findLatestByFundIds: unitOfWork.quotas.findLatestByFundIds,
      },
      new Date("2024-01-15"),
    );

    const [STALEST] = RESULT;
    expect(STALEST.fund.id).toBe(EntityId.create(ID.FUND.DEFAULT));
  });

  it("marks funds with no quota as null staleness and sorts them last", async () => {
    unitOfWork.seed({
      funds: [OTHER_FUND, FUND],
      quotas: [
        Quota.create({
          fundId: EntityId.create(ID.FUND.DEFAULT),
          date: new Date("2024-01-01"),
          price: QuotaPrice.create("10"),
        }),
      ],
    });

    const RESULT = await listFundStaleness(
      {
        findAll: unitOfWork.funds.findAll,
        findLatestByFundIds: unitOfWork.quotas.findLatestByFundIds,
      },
      new Date("2024-01-15"),
    );

    const WITH_NULL = RESULT.find((E) => E.daysSinceLatest === null);
    expect(WITH_NULL?.fund.id).toBe(EntityId.create(ID.FUND.OTHER));
    expect(WITH_NULL?.latestQuotaDate).toBeNull();
  });
});
