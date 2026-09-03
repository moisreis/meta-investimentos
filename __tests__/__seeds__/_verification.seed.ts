import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Verification } from "@/business/entities";
import { Verification as VerificationEntity } from "@/business/entities/user/verification.entity";
import { verification } from "@/infrastructure/database/schemas";

/**
 * Represents the shared expiration date for verification fixtures.
 */
const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

/**
 * Represents the default verification fixture for tests.
 *
 * Creates a `Verification` with the `reset-password`
 * identifier for `jose@example.com`.
 */
const VERIFICATION = VerificationEntity.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "reset-token",
    expiresAt: EXPIRES_AT,
  },
  ID.VERIFICATION.DEFAULT,
);

/**
 * Represents a secondary verification fixture for tests.
 *
 * Creates a `Verification` with the `reset-password`
 * identifier for `maria@example.com`.
 */
const OTHER_VERIFICATION = VerificationEntity.create(
  {
    identifier: "reset-password:maria@example.com",
    value: "other-reset-token",
    expiresAt: EXPIRES_AT,
  },
  ID.VERIFICATION.OTHER,
);

/**
 * Represents a second verification fixture for tests.
 *
 * Creates a `Verification` with the same identifier as
 * `VERIFICATION` but a different token value. Use this
 * to test multiple verifications for the same user.
 */
const SECOND_VERIFICATION = VerificationEntity.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "second-reset-token",
    expiresAt: EXPIRES_AT,
  },
  ID.VERIFICATION.SECOND,
);

/**
 * Represents an updated version of the default verification fixture.
 *
 * Creates a `Verification` with the same ID as `VERIFICATION`
 * but with the `updated-reset-token` token value.
 */
const UPDATED_VERIFICATION = VerificationEntity.create(
  {
    identifier: VERIFICATION.identifier,
    value: "updated-reset-token",
    expiresAt: EXPIRES_AT,
  },
  ID.VERIFICATION.DEFAULT,
);

/**
 * Represents a fresh verification fixture without a fixed ID.
 *
 * Creates a `Verification` with the `reset-password`
 * identifier for `fresh@example.com`. The entity generates
 * a new ID when created.
 */
const FRESH_VERIFICATION = VerificationEntity.create({
  identifier: "reset-password:fresh@example.com",
  value: "fresh-token",
  expiresAt: EXPIRES_AT,
});

/**
 * Represents the default pair of verification fixtures for tests.
 */
const VERIFICATIONS = [VERIFICATION, OTHER_VERIFICATION];

/**
 * Represents the default verification ID used in tests.
 */
const VERIFICATION_ID = ID.VERIFICATION.DEFAULT;

/**
 * Represents the other verification ID used in tests.
 */
const OTHER_VERIFICATION_ID = ID.VERIFICATION.OTHER;

/**
 * Represents the second verification ID used in tests.
 */
const SECOND_VERIFICATION_ID = ID.VERIFICATION.SECOND;

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

/**
 * Seeds the default and other verification fixtures into
 * the database.
 *
 * Inserts the `VERIFICATION` and `OTHER_VERIFICATION`
 * fixtures into the `verification` table.
 *
 * @returns An array containing the seeded `VERIFICATION`
 *          and `OTHER_VERIFICATION` instances.
 */
export async function seedVerifications(): Promise<Verification[]> {
  for (const fixture of [VERIFICATION, OTHER_VERIFICATION]) {
    await db
      .insert(verification)
      .values({ ...toVerificationRow(fixture), id: fixture.id });
  }

  return [VERIFICATION, OTHER_VERIFICATION];
}

/**
 * Seeds the second verification fixture into the database.
 *
 * Inserts the `SECOND_VERIFICATION` fixture into the
 * `verification` table.
 *
 * @returns The seeded `SECOND_VERIFICATION` instance.
 */
export async function seedSecondVerification(): Promise<Verification> {
  await db.insert(verification).values({
    ...toVerificationRow(SECOND_VERIFICATION),
    id: SECOND_VERIFICATION.id,
  });

  return SECOND_VERIFICATION;
}
