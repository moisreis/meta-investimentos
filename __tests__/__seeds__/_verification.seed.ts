import { db } from "@/__tests__/__setup__/_database.setup";
import { Verification } from "@/business/entities";
import { verification } from "@/infrastructure/database/schemas";
import { EXPIRES_AT } from "./_user.seed";

export const VERIFICATION_ID = "e5f6a7b8-9c0d-4e1f-8a2b-3c4d5e6f7a8b";
export const OTHER_VERIFICATION_ID = "f6a7b8c9-0d1e-4f2a-9b3c-4d5e6f7a8b9c";
export const SECOND_VERIFICATION_ID = "7a8b9c0d-1e2f-4a3b-9c4d-5e6f7a8b9c0d";

export const VERIFICATION = Verification.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "reset-token",
    expiresAt: EXPIRES_AT,
  },
  VERIFICATION_ID,
);

export const OTHER_VERIFICATION = Verification.create(
  {
    identifier: "reset-password:maria@example.com",
    value: "other-reset-token",
    expiresAt: EXPIRES_AT,
  },
  OTHER_VERIFICATION_ID,
);

export const SECOND_VERIFICATION = Verification.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "second-reset-token",
    expiresAt: EXPIRES_AT,
  },
  SECOND_VERIFICATION_ID,
);

export const VERIFICATIONS = [VERIFICATION, OTHER_VERIFICATION];

export const UPDATED_VERIFICATION = Verification.create(
  {
    identifier: VERIFICATION.identifier,
    value: "updated-reset-token",
    expiresAt: EXPIRES_AT,
  },
  VERIFICATION_ID,
);

export const FRESH_VERIFICATION = Verification.create({
  identifier: "reset-password:fresh@example.com",
  value: "fresh-token",
  expiresAt: EXPIRES_AT,
});

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
