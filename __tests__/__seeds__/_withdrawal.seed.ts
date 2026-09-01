import { db } from "@/__tests__/__setup__/_database.setup";
import { Withdrawal } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import { withdrawal } from "@/infrastructure/database/schemas";
import { WithdrawalRepository } from "@/infrastructure/repositories";
import { POSITION_ID, seedPositionById } from "./_position.seed";
import { seedTransactionContext } from "./_transaction.seed";
import { USER_ID } from "./_user.seed";

export const WITHDRAWAL_ID = "6e7f8a9b-0c1d-4e2f-9a3b-4c5d6e7f8a9b";
export const OTHER_WITHDRAWAL_ID = "7f8a9b0c-1d2e-4f3a-8b4c-5d6e7f8a9b0c";
export const EXTERNAL_WITHDRAWAL_ID = "708192a3-bc0d-4e2f-9a3b-4c5d6e7f8091";
export const PERIOD_OUTSIDE_WITHDRAWAL_ID =
  "8192a3b4-cd0e-4f3a-8b4c-5d6e7f8091a2";

export const WITHDRAWAL_DATE = new Date("2026-01-20T00:00:00.000Z");
export const OTHER_WITHDRAWAL_DATE = new Date("2026-02-20T00:00:00.000Z");

export const WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: WITHDRAWAL_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
  },
  WITHDRAWAL_ID,
);

export const OTHER_WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: OTHER_WITHDRAWAL_DATE,
    amount: PositiveMoney.create("250.00"),
    quotas: QuotaQuantity.create("3.0615"),
  },
  OTHER_WITHDRAWAL_ID,
);

export const EXTERNAL_WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-01-22T00:00:00.000Z"),
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("1.2"),
  },
  EXTERNAL_WITHDRAWAL_ID,
);

export const PERIOD_OUTSIDE_WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-03-10T00:00:00.000Z"),
    amount: PositiveMoney.create("150.00"),
    quotas: QuotaQuantity.create("1.8"),
  },
  PERIOD_OUTSIDE_WITHDRAWAL_ID,
);

export const WITHDRAWALS = [
  WITHDRAWAL,
  OTHER_WITHDRAWAL,
  EXTERNAL_WITHDRAWAL,
  PERIOD_OUTSIDE_WITHDRAWAL,
];

export const UPDATED_WITHDRAWAL = Withdrawal.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: WITHDRAWAL_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
    reversedAt: new Date("2026-02-01T00:00:00.000Z"),
    reversedByUserId: EntityId.create(USER_ID),
  },
  WITHDRAWAL_ID,
);

export const FRESH_WITHDRAWAL = Withdrawal.create({
  positionId: EntityId.create(POSITION_ID),
  date: new Date("2026-04-20T00:00:00.000Z"),
  amount: PositiveMoney.create("300.00"),
  quotas: QuotaQuantity.create("3.4"),
});

export const WITHDRAWAL_SUM_AMOUNT = PositiveMoney.create("600.00");
export const WITHDRAWAL_SUM_QUOTAS = QuotaQuantity.create("7.323");

export async function seedWithdrawalById(id: string): Promise<Withdrawal> {
  const REPOSITORY = new WithdrawalRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
  if (EXISTING) return EXISTING;

  const FIXTURE = id === WITHDRAWAL_ID ? WITHDRAWAL : OTHER_WITHDRAWAL;

  await seedPositionById(FIXTURE.positionId);

  await db.insert(withdrawal).values({
    id: FIXTURE.id,
    positionId: FIXTURE.positionId,
    date: FIXTURE.date,
    amount: FIXTURE.amount.value.toString(),
    quotas: FIXTURE.quotas.value.toString(),
    reversedAt: FIXTURE.reversedAt,
    reversedByUserId: FIXTURE.reversedByUserId,
    createdAt: FIXTURE.createdAt,
    updatedAt: FIXTURE.updatedAt,
  });

  return FIXTURE;
}

export async function seedWithdrawals(): Promise<Withdrawal[]> {
  return [
    await seedWithdrawalById(WITHDRAWAL_ID),
    await seedWithdrawalById(OTHER_WITHDRAWAL_ID),
  ];
}

export async function seedAllWithdrawals(): Promise<Withdrawal[]> {
  await seedTransactionContext();

  for (const fixture of [EXTERNAL_WITHDRAWAL, PERIOD_OUTSIDE_WITHDRAWAL]) {
    await db.insert(withdrawal).values({
      id: fixture.id,
      positionId: fixture.positionId,
      date: fixture.date,
      amount: fixture.amount.value.toString(),
      quotas: fixture.quotas.value.toString(),
      reversedAt: fixture.reversedAt,
      reversedByUserId: fixture.reversedByUserId,
      createdAt: fixture.createdAt,
      updatedAt: fixture.updatedAt,
    });
  }

  return WITHDRAWALS;
}
