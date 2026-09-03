import { ID } from "@/__tests__/__fixtures__/_ids";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Application } from "@/business/entities";
import { Application as ApplicationEntity } from "@/business/entities/portfolio/application.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { application } from "@/infrastructure/database/schemas";
import { ApplicationRepository } from "@/infrastructure/repositories";
import { seedPositionById } from "./_position.seed";
import { seedTransactionContext } from "./_transaction.seed";

/**
 * Represents the default application
 * identifier.
 */
export const APPLICATION_ID = ID.APPLICATION.DEFAULT;

/**
 * Represents the alternate application
 * identifier.
 */
export const OTHER_APPLICATION_ID = ID.APPLICATION.OTHER;

/**
 * Represents the external application
 * identifier.
 */
export const EXTERNAL_APPLICATION_ID = ID.APPLICATION.EXTERNAL;

/**
 * Represents the period-outside application
 * identifier.
 */
export const PERIOD_OUTSIDE_APPLICATION_ID = ID.APPLICATION.PERIOD_OUTSIDE;

/**
 * Represents the default application date
 * used in standard test scenarios.
 */
export const APPLICATION_DATE = new Date("2026-01-15T00:00:00.000Z");

/**
 * Represents the alternate application date
 * used in multi-operation test scenarios.
 */
export const OTHER_APPLICATION_DATE = new Date("2026-02-15T00:00:00.000Z");

/**
 * Represents the default application fixture
 * with an amount of 1000.00.
 */
export const APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
  },
  ID.APPLICATION.DEFAULT,
);

/**
 * Represents an alternate application fixture
 * with an amount of 500.00.
 */
export const OTHER_APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: OTHER_APPLICATION_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
  },
  ID.APPLICATION.OTHER,
);

/**
 * Represents an external application fixture
 * outside the default date range.
 */
export const EXTERNAL_APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-01-18T00:00:00.000Z"),
    amount: PositiveMoney.create("200.00"),
    quotas: QuotaQuantity.create("2.4"),
  },
  ID.APPLICATION.EXTERNAL,
);

/**
 * Represents an application fixture whose
 * date falls outside a standard test period.
 */
export const PERIOD_OUTSIDE_APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-03-05T00:00:00.000Z"),
    amount: PositiveMoney.create("400.00"),
    quotas: QuotaQuantity.create("4.8"),
  },
  ID.APPLICATION.PERIOD_OUTSIDE,
);

/**
 * Represents an application fixture with
 * reversal metadata set.
 */
export const UPDATED_APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
    reversedAt: new Date("2026-01-30T00:00:00.000Z"),
    reversedByUserId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.APPLICATION.DEFAULT,
);

/**
 * Represents an application fixture with
 * a generated ID for insert tests.
 */
export const FRESH_APPLICATION = ApplicationEntity.create({
  positionId: EntityId.create(ID.POSITION.DEFAULT),
  date: new Date("2026-04-15T00:00:00.000Z"),
  amount: PositiveMoney.create("750.00"),
  quotas: QuotaQuantity.create("8.5"),
});

/**
 * Represents the full set of application
 * fixtures for aggregate test scenarios.
 */
export const APPLICATIONS = [
  APPLICATION,
  OTHER_APPLICATION,
  EXTERNAL_APPLICATION,
  PERIOD_OUTSIDE_APPLICATION,
];

/**
 * Represents the expected sum of amounts
 * across the default and alternate
 * application fixtures.
 */
export const APPLICATION_SUM_AMOUNT = PositiveMoney.create("1200.00");

/**
 * Represents the expected sum of quota
 * quantities across the default and
 * alternate application fixtures.
 */
export const APPLICATION_SUM_QUOTAS = QuotaQuantity.create("14.745");

/**
 * Represents a January date window used
 * in period-boundary test scenarios.
 */
export const JANUARY_WINDOW = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-31T00:00:00.000Z"),
};

/**
 * Seeds a single {@link Application} row
 * by its identifier.
 *
 * Returns the existing row when the
 * identifier already exists in the
 * database. Seeds the parent position
 * before inserting the application.
 *
 * @param id - The application identifier.
 * @returns The seeded {@link Application}.
 */
export async function seedApplicationById(id: string): Promise<Application> {
  const REPOSITORY = new ApplicationRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
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

/**
 * Seeds the default and alternate
 * application rows into the database.
 *
 * @returns The seeded {@link Application}
 *          array with both entries.
 */
export async function seedApplications(): Promise<Application[]> {
  return [
    await seedApplicationById(APPLICATION_ID),
    await seedApplicationById(OTHER_APPLICATION_ID),
  ];
}

/**
 * Seeds all application fixtures into the
 * database, including external and
 * period-outside entries.
 *
 * Seeds the transaction context before
 * inserting the additional fixtures.
 *
 * @returns The full {@link Application}
 *          array.
 */
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
