import { ID } from "@/__tests__/__fixtures__/_ids";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Withdrawal } from "@/business/entities";
import { Withdrawal as WithdrawalEntity } from "@/business/entities/portfolio/withdrawal.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { withdrawal } from "@/infrastructure/database/schemas";
import { WithdrawalRepository } from "@/infrastructure/repositories";
import { seedPositionById } from "./_position.seed";
import { seedTransactionContext } from "./_transaction.seed";

/**
 * Represents the default withdrawal identifier for test fixtures.
 */
export const WITHDRAWAL_ID = ID.WITHDRAWAL.DEFAULT;

/**
 * Represents an alternate withdrawal identifier for test fixtures.
 */
export const OTHER_WITHDRAWAL_ID = ID.WITHDRAWAL.OTHER;

/**
 * Represents a withdrawal identifier outside the standard position.
 */
export const EXTERNAL_WITHDRAWAL_ID = ID.WITHDRAWAL.EXTERNAL;

/**
 * Represents a withdrawal identifier that falls outside the test period.
 */
export const PERIOD_OUTSIDE_WITHDRAWAL_ID = ID.WITHDRAWAL.PERIOD_OUTSIDE;

/**
 * Represents the default test withdrawal date.
 * Set to 2026-01-20.
 */
export const WITHDRAWAL_DATE = new Date("2026-01-20T00:00:00.000Z");

/**
 * Represents the alternate test withdrawal date.
 * Set to 2026-02-20.
 */
export const OTHER_WITHDRAWAL_DATE = new Date("2026-02-20T00:00:00.000Z");

/**
 * Represents a default withdrawal fixture.
 * The withdrawal belongs to the default position. It has a
 * date of 2026-01-20, an amount of `500.00`, and quotas of
 * `6.123`.
 */
export const WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: WITHDRAWAL_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
  },
  ID.WITHDRAWAL.DEFAULT,
);

/**
 * Represents an alternate withdrawal fixture.
 * The withdrawal belongs to the default position. It has a
 * date of 2026-02-20, an amount of `250.00`, and quotas of
 * `3.0615`.
 */
export const OTHER_WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: OTHER_WITHDRAWAL_DATE,
    amount: PositiveMoney.create("250.00"),
    quotas: QuotaQuantity.create("3.0615"),
  },
  ID.WITHDRAWAL.OTHER,
);

/**
 * Represents an external withdrawal fixture.
 * The withdrawal belongs to the default position. It has a
 * date of 2026-01-22, an amount of `100.00`, and quotas of
 * `1.2`.
 */
export const EXTERNAL_WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-01-22T00:00:00.000Z"),
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("1.2"),
  },
  ID.WITHDRAWAL.EXTERNAL,
);

/**
 * Represents a withdrawal fixture that falls outside the
 * default test period. The withdrawal has a date of
 * 2026-03-10, an amount of `150.00`, and quotas of `1.8`.
 */
export const PERIOD_OUTSIDE_WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-03-10T00:00:00.000Z"),
    amount: PositiveMoney.create("150.00"),
    quotas: QuotaQuantity.create("1.8"),
  },
  ID.WITHDRAWAL.PERIOD_OUTSIDE,
);

/**
 * Represents an updated withdrawal fixture.
 * The fixture uses the default withdrawal ID but includes
 * reversal fields: `reversedAt` and `reversedByUserId`.
 */
export const UPDATED_WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: WITHDRAWAL_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
    reversedAt: new Date("2026-02-01T00:00:00.000Z"),
    reversedByUserId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.WITHDRAWAL.DEFAULT,
);

/**
 * Represents a fresh withdrawal fixture.
 * The fixture has no persisted ID. It belongs to the default
 * position with a date of 2026-04-20.
 */
export const FRESH_WITHDRAWAL = WithdrawalEntity.create({
  positionId: EntityId.create(ID.POSITION.DEFAULT),
  date: new Date("2026-04-20T00:00:00.000Z"),
  amount: PositiveMoney.create("300.00"),
  quotas: QuotaQuantity.create("3.4"),
});

/**
 * Represents the collection of all standard withdrawal
 * fixtures. Includes the default, alternate, external,
 * and period-outside withdrawals.
 */
export const WITHDRAWALS = [
  WITHDRAWAL,
  OTHER_WITHDRAWAL,
  EXTERNAL_WITHDRAWAL,
  PERIOD_OUTSIDE_WITHDRAWAL,
];

/**
 * Represents the sum of amounts across the default and
 * alternate withdrawals. Equals `600.00`.
 */
export const WITHDRAWAL_SUM_AMOUNT = PositiveMoney.create("600.00");

/**
 * Represents the sum of quota quantities across the default
 * and alternate withdrawals. Equals `7.323`.
 */
export const WITHDRAWAL_SUM_QUOTAS = QuotaQuantity.create("7.323");

/**
 * Seeds a withdrawal by its identifier into the database.
 *
 * The function returns the existing withdrawal if one with
 * the given `id` already exists. Otherwise it selects the
 * appropriate fixture, seeds the related position, and
 * inserts the withdrawal row.
 *
 * @param id - The withdrawal identifier to seed.
 * @returns The seeded or existing {@link Withdrawal}.
 */
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

/**
 * Seeds the default and alternate withdrawals into the
 * database.
 *
 * @returns An array containing the default and alternate
 *          {@link Withdrawal} fixtures.
 */
export async function seedWithdrawals(): Promise<Withdrawal[]> {
  return [
    await seedWithdrawalById(WITHDRAWAL_ID),
    await seedWithdrawalById(OTHER_WITHDRAWAL_ID),
  ];
}

/**
 * Seeds all withdrawal fixtures into the database.
 *
 * The function first seeds the transaction context to ensure
 * related application and withdrawal rows exist. It then
 * inserts the external and period-outside withdrawals
 * directly. Finally, it returns the full collection of
 * withdrawal fixtures.
 *
 * @returns The full array of {@link Withdrawal} fixtures.
 */
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
