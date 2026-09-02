import {
  EXPIRES_AT,
  FRESH_USER,
  OTHER_USER,
  OTHER_USER_ID,
  UPDATED_USER,
  USER,
  USER_ID,
  USER_IDS,
  USERS,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { User } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { user } from "@/infrastructure/database/schemas";
import { UserRepository } from "@/infrastructure/repositories";

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

export async function seedUsers(): Promise<User[]> {
  return [await seedUserById(USER_ID), await seedUserById(OTHER_USER_ID)];
}
