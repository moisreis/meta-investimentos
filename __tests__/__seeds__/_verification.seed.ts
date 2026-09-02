import {
  FRESH_VERIFICATION,
  OTHER_VERIFICATION,
  OTHER_VERIFICATION_ID,
  SECOND_VERIFICATION,
  SECOND_VERIFICATION_ID,
  UPDATED_VERIFICATION,
  VERIFICATION,
  VERIFICATION_ID,
  VERIFICATIONS,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Verification } from "@/business/entities";
import { verification } from "@/infrastructure/database/schemas";

export {
  VERIFICATION_ID,
  OTHER_VERIFICATION_ID,
  SECOND_VERIFICATION_ID,
  VERIFICATION,
  OTHER_VERIFICATION,
  SECOND_VERIFICATION,
  UPDATED_VERIFICATION,
  FRESH_VERIFICATION,
  VERIFICATIONS,
};

function toVerificationRow(
  entity: Verification,
): typeof verification.$inferInsert {
  return {
    identifier: entity.identifier,
    value: entity.value,
    expiresAt: entity.expiresAt,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export async function seedVerifications(): Promise<Verification[]> {
  for (const fixture of [VERIFICATION, OTHER_VERIFICATION]) {
    await db
      .insert(verification)
      .values({ ...toVerificationRow(fixture), id: fixture.id });
  }

  return [VERIFICATION, OTHER_VERIFICATION];
}

export async function seedSecondVerification(): Promise<Verification> {
  await db.insert(verification).values({
    ...toVerificationRow(SECOND_VERIFICATION),
    id: SECOND_VERIFICATION.id,
  });

  return SECOND_VERIFICATION;
}
