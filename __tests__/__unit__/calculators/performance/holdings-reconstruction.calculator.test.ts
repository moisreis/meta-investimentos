import { describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { reconstructPositionHoldings } from "@/business/calculators/performance/holdings-reconstruction.calculator";
import { Application } from "@/business/entities/portfolio/application.entity";
import { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

const D1 = new Date("2026-01-02T00:00:00.000Z");
const D2 = new Date("2026-01-03T00:00:00.000Z");
const D3 = new Date("2026-01-05T00:00:00.000Z");

const USER = EntityId.create(ID.USER.DEFAULT);

function makeApp(id: string, quotas: string, date: Date): Application {
  return Application.create(
    {
      positionId: EntityId.create(ID.POSITION.DEFAULT),
      date,
      amount: PositiveMoney.create("100"),
      quotas: QuotaQuantity.create(quotas),
    },
    id,
  );
}

function makeWithdrawal(id: string, quotas: string, date: Date): Withdrawal {
  return Withdrawal.create(
    {
      positionId: EntityId.create(ID.POSITION.DEFAULT),
      date,
      amount: PositiveMoney.create("100"),
      quotas: QuotaQuantity.create(quotas),
    },
    id,
  );
}

function makeAllocation(
  appId: string,
  withdrawalId: string,
  quotas: string,
): TransactionAllocation {
  return TransactionAllocation.create({
    applicationId: EntityId.create(appId),
    withdrawId: EntityId.create(withdrawalId),
    quotasConsumed: QuotaQuantity.create(quotas),
  });
}

describe("reconstructPositionHoldings", () => {
  it("returns full quotas when no withdrawals occurred", () => {
    const APP = makeApp(ID.APPLICATION.DEFAULT, "10", D1);

    const RESULT = reconstructPositionHoldings(D3, [APP], [], []);

    expect(RESULT.quotasHeld.toString()).toBe("10");
    expect(RESULT.lots).toHaveLength(1);
    expect(RESULT.lots[0].remainingQuotas.toString()).toBe("10");
    expect(RESULT.applicationAmount.toString()).toBe("100");
  });

  it("applies FIFO allocations to the correct application lot", () => {
    const APP_A = makeApp(ID.APPLICATION.DEFAULT, "10", D1);
    const APP_B = makeApp(ID.APPLICATION.OTHER, "5", D2);
    const WITHDRAWAL = makeWithdrawal(ID.WITHDRAWAL.DEFAULT, "6", D3);
    const ALLOCATION = makeAllocation(
      ID.APPLICATION.DEFAULT,
      ID.WITHDRAWAL.DEFAULT,
      "6",
    );

    const RESULT = reconstructPositionHoldings(
      D3,
      [APP_A, APP_B],
      [WITHDRAWAL],
      [ALLOCATION],
    );

    expect(RESULT.quotasHeld.toString()).toBe("9");
    expect(RESULT.lots).toHaveLength(2);
    expect(RESULT.lots[0].remainingQuotas.toString()).toBe("4");
    expect(RESULT.lots[1].remainingQuotas.toString()).toBe("5");
    expect(RESULT.withdrawalAmount.toString()).toBe("100");
  });

  it("excludes reversed applications from holdings", () => {
    const APP = makeApp(ID.APPLICATION.DEFAULT, "10", D1).reverse(USER, D2);

    const RESULT = reconstructPositionHoldings(D3, [APP], [], []);

    expect(RESULT.quotasHeld.toString()).toBe("0");
    expect(RESULT.lots).toHaveLength(0);
    expect(RESULT.applicationAmount.toString()).toBe("0");
  });

  it("ignores allocations tied to reversed withdrawals", () => {
    const APP = makeApp(ID.APPLICATION.DEFAULT, "10", D1);
    const WITHDRAWAL = makeWithdrawal(ID.WITHDRAWAL.DEFAULT, "6", D3).reverse(
      USER,
      D3,
    );
    const ALLOCATION = makeAllocation(
      ID.APPLICATION.DEFAULT,
      ID.WITHDRAWAL.DEFAULT,
      "6",
    );

    const RESULT = reconstructPositionHoldings(
      D3,
      [APP],
      [WITHDRAWAL],
      [ALLOCATION],
    );

    expect(RESULT.quotasHeld.toString()).toBe("10");
  });

  it("only counts flows at or before the snapshot date", () => {
    const APP = makeApp(ID.APPLICATION.DEFAULT, "10", D3);
    const WITHDRAWAL = makeWithdrawal(ID.WITHDRAWAL.DEFAULT, "6", D3);
    const ALLOCATION = makeAllocation(
      ID.APPLICATION.DEFAULT,
      ID.WITHDRAWAL.DEFAULT,
      "6",
    );

    const BEFORE = reconstructPositionHoldings(
      D2,
      [APP],
      [WITHDRAWAL],
      [ALLOCATION],
    );
    expect(BEFORE.quotasHeld.toString()).toBe("0");
  });

  it("floors remaining quotas at zero", () => {
    const APP = makeApp(ID.APPLICATION.DEFAULT, "5", D1);
    const WITHDRAWAL = makeWithdrawal(ID.WITHDRAWAL.DEFAULT, "10", D3);
    const ALLOCATION = makeAllocation(
      ID.APPLICATION.DEFAULT,
      ID.WITHDRAWAL.DEFAULT,
      "10",
    );

    const RESULT = reconstructPositionHoldings(
      D3,
      [APP],
      [WITHDRAWAL],
      [ALLOCATION],
    );

    expect(RESULT.quotasHeld.toString()).toBe("0");
    expect(RESULT.lots[0].remainingQuotas.toString()).toBe("0");
  });
});
