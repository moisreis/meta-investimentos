import {
  EXTERNAL_WITHDRAWAL,
  EXTERNAL_WITHDRAWAL_ID,
  FRESH_WITHDRAWAL,
  OTHER_WITHDRAWAL,
  OTHER_WITHDRAWAL_DATE,
  OTHER_WITHDRAWAL_ID,
  PERIOD_OUTSIDE_WITHDRAWAL,
  PERIOD_OUTSIDE_WITHDRAWAL_ID,
  UPDATED_WITHDRAWAL,
  WITHDRAWAL,
  WITHDRAWAL_DATE,
  WITHDRAWAL_ID,
  WITHDRAWAL_SUM_AMOUNT,
  WITHDRAWAL_SUM_QUOTAS,
  WITHDRAWALS,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Withdrawal } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { withdrawal } from "@/infrastructure/database/schemas";
import { WithdrawalRepository } from "@/infrastructure/repositories";
import { seedPositionById } from "./_position.seed";
import { seedTransactionContext } from "./_transaction.seed";

export {
  WITHDRAWAL_ID,
  OTHER_WITHDRAWAL_ID,
  EXTERNAL_WITHDRAWAL_ID,
  PERIOD_OUTSIDE_WITHDRAWAL_ID,
  WITHDRAWAL_DATE,
  OTHER_WITHDRAWAL_DATE,
  WITHDRAWAL,
  OTHER_WITHDRAWAL,
  EXTERNAL_WITHDRAWAL,
  PERIOD_OUTSIDE_WITHDRAWAL,
  UPDATED_WITHDRAWAL,
  FRESH_WITHDRAWAL,
  WITHDRAWALS,
  WITHDRAWAL_SUM_AMOUNT,
  WITHDRAWAL_SUM_QUOTAS,
};

export async function seedWithdrawalById(id: string): Promise<Withdrawal> {
  const REPOSITORY = new WithdrawalRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
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
