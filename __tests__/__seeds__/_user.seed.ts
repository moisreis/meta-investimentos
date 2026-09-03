import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { User } from "@/business/entities";
import { User as UserEntity } from "@/business/entities/user/user.entity";
import { CPF } from "@/business/value-objects/cpf.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { user } from "@/infrastructure/database/schemas";
import { UserRepository } from "@/infrastructure/repositories";

/**
 * Represents the shared expiration date used in user tests.
 */
const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

/**
 * Represents the default user fixture for tests.
 *
 * Creates a `User` with the name `José da Silva` and a
 * valid CPF value. Use this as the primary user fixture.
 */
const USER = UserEntity.create(
  {
    name: "José da Silva",
    email: "jose@example.com",
    firstName: "José",
    lastName: "da Silva",
    cpf: CPF.create("52998224725"),
  },
  ID.USER.DEFAULT,
);

/**
 * Represents a secondary user fixture for tests.
 *
 * Creates a `User` with the name `Maria Souza` and a
 * valid CPF value.
 */
const OTHER_USER = UserEntity.create(
  {
    name: "Maria Souza",
    email: "maria@example.com",
    firstName: "Maria",
    lastName: "Souza",
    cpf: CPF.create("12345678909"),
  },
  ID.USER.OTHER,
);

/**
 * Represents a fresh user fixture without a fixed ID.
 *
 * Creates a `User` with the name `Felipe Rocha`. The
 * entity generates a new ID when created.
 */
const FRESH_USER = UserEntity.create({
  name: "Felipe Rocha",
  email: "felipe@example.com",
  firstName: "Felipe",
  lastName: "Rocha",
  cpf: CPF.create("11144477735"),
});

/**
 * Represents an updated version of the default user fixture.
 *
 * Creates a `User` with the same ID as `USER` but with the
 * name `José da Silva Junior`.
 */
const UPDATED_USER = UserEntity.create(
  {
    name: "José da Silva Junior",
    email: USER.email,
    firstName: USER.firstName,
    lastName: "da Silva Junior",
    cpf: USER.cpf,
  },
  ID.USER.DEFAULT,
);

/**
 * Represents the default pair of user fixtures for tests.
 */
const USERS = [USER, OTHER_USER];

/**
 * Represents the default pair of user IDs for tests.
 */
const USER_IDS = [ID.USER.DEFAULT, ID.USER.OTHER];

/**
 * Represents the default user ID used in tests.
 */
const USER_ID = ID.USER.DEFAULT;

/**
 * Represents the other user ID used in tests.
 */
const OTHER_USER_ID = ID.USER.OTHER;

export {
  USER_ID,
  OTHER_USER_ID,
  USER,
  OTHER_USER,
  FRESH_USER,
  UPDATED_USER,
  USERS,
  USER_IDS,
  EXPIRES_AT,
};

/**
 * Seeds a user row into the database by its ID.
 *
 * Looks up the user in the database first. Returns the
 * existing row when found. Inserts the corresponding
 * fixture when the row does not exist.
 *
 * @param id - The user ID to seed.
 * @returns The existing or newly seeded `User` instance.
 */
export async function seedUserById(id: string): Promise<User> {
  const REPOSITORY = new UserRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
  if (EXISTING) return EXISTING;

  const FIXTURE = id === USER_ID ? USER : OTHER_USER;

  await db.insert(user).values({
    id: FIXTURE.id,
    name: FIXTURE.name,
    email: FIXTURE.email,
    firstName: FIXTURE.firstName,
    lastName: FIXTURE.lastName,
    cpf: FIXTURE.cpf.value,
    role: FIXTURE.role,
    emailVerified: FIXTURE.emailVerified,
    image: FIXTURE.image,
    createdAt: FIXTURE.createdAt,
    updatedAt: FIXTURE.updatedAt,
  });

  return FIXTURE;
}

/**
 * Seeds the default and other user fixtures into the database.
 *
 * Calls {@link seedUserById} for each default user ID.
 *
 * @returns An array containing the seeded `USER` and
 *          `OTHER_USER` instances.
 */
export async function seedUsers(): Promise<User[]> {
  return [await seedUserById(USER_ID), await seedUserById(OTHER_USER_ID)];
}
