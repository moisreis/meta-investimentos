import {
  APPLICATION,
  APPLICATION_DATE,
  APPLICATION_ID,
  APPLICATION_SUM_AMOUNT,
  APPLICATION_SUM_QUOTAS,
  APPLICATIONS,
  EXTERNAL_APPLICATION,
  EXTERNAL_APPLICATION_ID,
  FRESH_APPLICATION,
  JANUARY_WINDOW,
  OTHER_APPLICATION,
  OTHER_APPLICATION_DATE,
  OTHER_APPLICATION_ID,
  PERIOD_OUTSIDE_APPLICATION,
  PERIOD_OUTSIDE_APPLICATION_ID,
  UPDATED_APPLICATION,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Application } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { application } from "@/infrastructure/database/schemas";
import { ApplicationRepository } from "@/infrastructure/repositories";
import { seedPositionById } from "./_position.seed";
import { seedTransactionContext } from "./_transaction.seed";

export {
  APPLICATION_ID,
  OTHER_APPLICATION_ID,
  EXTERNAL_APPLICATION_ID,
  PERIOD_OUTSIDE_APPLICATION_ID,
  APPLICATION_DATE,
  OTHER_APPLICATION_DATE,
  APPLICATION,
  OTHER_APPLICATION,
  EXTERNAL_APPLICATION,
  PERIOD_OUTSIDE_APPLICATION,
  UPDATED_APPLICATION,
  FRESH_APPLICATION,
  APPLICATIONS,
  JANUARY_WINDOW,
  APPLICATION_SUM_AMOUNT,
  APPLICATION_SUM_QUOTAS,
};

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
