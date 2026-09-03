import { db } from "@/__tests__/__setup__/_database.setup";
import {
  AccountRepository,
  SessionRepository,
  UserRepository,
  VerificationRepository,
} from "@/infrastructure/repositories";

/**
 * Re-exports the account seed fixtures and functions
 * used by account repository tests.
 */
export {
  ACCOUNT,
  ACCOUNT_ID,
  ACCOUNTS,
  FRESH_ACCOUNT,
  OTHER_ACCOUNT,
  OTHER_ACCOUNT_ID,
  seedAccounts,
  seedThirdAccount,
  THIRD_ACCOUNT,
  THIRD_ACCOUNT_ID,
  UPDATED_ACCOUNT,
} from "@/__tests__/__seeds__/_account.seed";

/**
 * Re-exports the session seed fixtures and functions
 * used by session repository tests.
 */
export {
  FRESH_SESSION,
  OTHER_SESSION,
  OTHER_SESSION_ID,
  SESSION,
  SESSION_ID,
  SESSIONS,
  seedSessions,
  seedThirdSession,
  THIRD_SESSION,
  THIRD_SESSION_ID,
  UPDATED_SESSION,
} from "@/__tests__/__seeds__/_session.seed";

/**
 * Re-exports the user seed fixtures and functions used
 * by user repository tests.
 */
export {
  EXPIRES_AT,
  FRESH_USER,
  OTHER_USER,
  OTHER_USER_ID,
  seedUserById,
  seedUsers,
  UPDATED_USER,
  USER,
  USER_ID,
  USER_IDS,
  USERS,
} from "@/__tests__/__seeds__/_user.seed";

/**
 * Re-exports the verification seed fixtures and functions
 * used by verification repository tests.
 */
export {
  FRESH_VERIFICATION,
  OTHER_VERIFICATION,
  OTHER_VERIFICATION_ID,
  SECOND_VERIFICATION,
  SECOND_VERIFICATION_ID,
  seedSecondVerification,
  seedVerifications,
  UPDATED_VERIFICATION,
  VERIFICATION,
  VERIFICATION_ID,
  VERIFICATIONS,
} from "@/__tests__/__seeds__/_verification.seed";

/**
 * Creates a new `UserRepository` bound to the shared
 * test database.
 *
 * @returns A new `UserRepository` instance.
 */
export function newUserRepository(): UserRepository {
  return new UserRepository(db);
}

/**
 * Creates a new `AccountRepository` bound to the
 * shared test database.
 *
 * @returns A new `AccountRepository` instance.
 */
export function newAccountRepository(): AccountRepository {
  return new AccountRepository(db);
}

/**
 * Creates a new `SessionRepository` bound to the
 * shared test database.
 *
 * @returns A new `SessionRepository` instance.
 */
export function newSessionRepository(): SessionRepository {
  return new SessionRepository(db);
}

/**
 * Creates a new `VerificationRepository` bound to
 * the shared test database.
 *
 * @returns A new `VerificationRepository` instance.
 */
export function newVerificationRepository(): VerificationRepository {
  return new VerificationRepository(db);
}
