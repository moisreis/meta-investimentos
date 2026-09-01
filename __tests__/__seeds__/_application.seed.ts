import { db } from "@/__tests__/__setup__/_database.setup";
import { Application } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import { application } from "@/infrastructure/database/schemas";
import { ApplicationRepository } from "@/infrastructure/repositories";
import { POSITION_ID, seedPositionById } from "./_position.seed";
import { seedTransactionContext } from "./_transaction.seed";
import { USER_ID } from "./_user.seed";

export const APPLICATION_ID = "4c5d6e7f-8a9b-4c0d-9e1f-2a3b4c5d6e7f";
export const OTHER_APPLICATION_ID = "5d6e7f8a-9b0c-4d1e-8f2a-3b4c5d6e7f8a";
export const EXTERNAL_APPLICATION_ID = "5e5f6071-8a9b-4c0d-9e1f-2a3b4c5d6e7f";
export const PERIOD_OUTSIDE_APPLICATION_ID =
  "6f607182-9a0b-4d1e-8f2a-3b4c5d6e7f80";

export const APPLICATION_DATE = new Date("2026-01-15T00:00:00.000Z");
export const OTHER_APPLICATION_DATE = new Date("2026-02-15T00:00:00.000Z");

export const APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
  },
  APPLICATION_ID,
);

export const OTHER_APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: OTHER_APPLICATION_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
  },
  OTHER_APPLICATION_ID,
);

export const EXTERNAL_APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-01-18T00:00:00.000Z"),
    amount: PositiveMoney.create("200.00"),
    quotas: QuotaQuantity.create("2.4"),
  },
  EXTERNAL_APPLICATION_ID,
);

export const PERIOD_OUTSIDE_APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: new Date("2026-03-05T00:00:00.000Z"),
    amount: PositiveMoney.create("400.00"),
    quotas: QuotaQuantity.create("4.8"),
  },
  PERIOD_OUTSIDE_APPLICATION_ID,
);

export const APPLICATIONS = [
  APPLICATION,
  OTHER_APPLICATION,
  EXTERNAL_APPLICATION,
  PERIOD_OUTSIDE_APPLICATION,
];

export const UPDATED_APPLICATION = Application.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
    reversedAt: new Date("2026-01-30T00:00:00.000Z"),
    reversedByUserId: EntityId.create(USER_ID),
  },
  APPLICATION_ID,
);

export const FRESH_APPLICATION = Application.create({
  positionId: EntityId.create(POSITION_ID),
  date: new Date("2026-04-15T00:00:00.000Z"),
  amount: PositiveMoney.create("750.00"),
  quotas: QuotaQuantity.create("8.5"),
});

export const JANUARY_WINDOW = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-31T00:00:00.000Z"),
};

export const APPLICATION_SUM_AMOUNT = PositiveMoney.create("1200.00");
export const APPLICATION_SUM_QUOTAS = QuotaQuantity.create("14.745");

export async function seedApplicationById(id: string): Promise<Application> {
  const REPOSITORY = new ApplicationRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
  if (EXISTING) return EXISTING;

  const FIXTURE = id === APPLICATION_ID ? APPLICATION : OTHER_APPLICATION;

  await seedPositionById(FIXTURE.positionId);

  await db.insert(application).values({
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

export async function seedApplications(): Promise<Application[]> {
  return [
    await seedApplicationById(APPLICATION_ID),
    await seedApplicationById(OTHER_APPLICATION_ID),
  ];
}

export async function seedAllApplications(): Promise<Application[]> {
  await seedTransactionContext();

  for (const fixture of [EXTERNAL_APPLICATION, PERIOD_OUTSIDE_APPLICATION]) {
    await db.insert(application).values({
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

  return APPLICATIONS;
}
