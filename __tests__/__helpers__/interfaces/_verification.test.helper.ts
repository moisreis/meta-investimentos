import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Verification } from "@/business/entities/user/verification.entity";
import type { IVerification } from "@/business/interfaces/user/verification.interface";

/**
 * Represents the shared expiration date for verification fixtures.
 *
 * The date is `2026-02-01T00:00:00.000Z`.
 */
const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

/**
 * Represents the default verification fixture for tests.
 *
 * The fixture has the identifier
 * `reset-password:jose@example.com` and the value
 * `reset-token`.
 */
const VERIFICATION = Verification.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "reset-token",
    expiresAt: EXPIRES_AT,
  },
  ID.VERIFICATION.DEFAULT,
);

/**
 * Represents an alternative verification fixture for tests.
 *
 * The fixture has the identifier
 * `reset-password:maria@example.com` and the value
 * `other-reset-token`.
 */
const OTHER_VERIFICATION = Verification.create(
  {
    identifier: "reset-password:maria@example.com",
    value: "other-reset-token",
    expiresAt: EXPIRES_AT,
  },
  ID.VERIFICATION.OTHER,
);

/**
 * Represents a second verification fixture for the same user.
 *
 * The fixture shares the identifier with the default
 * verification but has a different value: `second-reset-token`.
 * Use this fixture to test multiple verifications per user.
 */
const SECOND_VERIFICATION = Verification.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "second-reset-token",
    expiresAt: EXPIRES_AT,
  },
  ID.VERIFICATION.SECOND,
);

/**
 * Represents an updated version of the default verification.
 *
 * The fixture keeps the same ID as the default verification.
 * The value changes to `updated-reset-token`.
 */
const UPDATED_VERIFICATION = Verification.create(
  {
    identifier: VERIFICATION.identifier,
    value: "updated-reset-token",
    expiresAt: EXPIRES_AT,
  },
  ID.VERIFICATION.DEFAULT,
);

/**
 * Represents a verification fixture without a predefined ID.
 *
 * The fixture has the identifier
 * `reset-password:fresh@example.com` and the value
 * `fresh-token`. The code generates the ID at creation.
 */
const FRESH_VERIFICATION = Verification.create({
  identifier: "reset-password:fresh@example.com",
  value: "fresh-token",
  expiresAt: EXPIRES_AT,
});

/**
 * Represents the entity ID of the default verification fixture.
 */
const VERIFICATION_ID = ID.VERIFICATION.DEFAULT;

/**
 * Represents the entity ID of the alternative verification fixture.
 */
const OTHER_VERIFICATION_ID = ID.VERIFICATION.OTHER;

/**
 * Represents the entity ID of the second verification fixture.
 */
const SECOND_VERIFICATION_ID = ID.VERIFICATION.SECOND;

export {
  EXPIRES_AT,
  FRESH_VERIFICATION,
  OTHER_VERIFICATION,
  OTHER_VERIFICATION_ID,
  SECOND_VERIFICATION,
  SECOND_VERIFICATION_ID,
  UPDATED_VERIFICATION,
  VERIFICATION,
  VERIFICATION_ID,
};

/**
 * Creates an in-memory implementation of the
 * {@link IVerification} repository interface.
 *
 * The repository stores {@link Verification} instances in
 * memory and supports lookup by ID and by identifier. Use
 * this factory in unit tests that need a persistent but
 * isolated verification store.
 *
 * @returns A fresh {@link IVerification} instance backed
 *          by memory.
 */
export function createInMemoryVerificationRepository(): IVerification {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IVerification["save"]>>
  >({ extractId: (v) => v.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByIdentifier(identifier) {
      return BASE.match((v) => v.identifier === identifier);
    },
    save: (verification) => BASE.save(verification),
    delete: (id) => BASE.delete(id),
  };
}
