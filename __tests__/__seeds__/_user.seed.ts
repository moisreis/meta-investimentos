import { db } from "@/__tests__/__setup__/_database.setup";
import { User } from "@/business/entities";
import { user } from "@/infrastructure/database/schemas";
import { UserRepository } from "@/infrastructure/repositories";

export const USER_ID = "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d";
export const OTHER_USER_ID = "1b2c3d4e-5f6a-4b7c-9d8e-0f1a2b3c4d5e";

export const USER = User.create(
  {
    name: "José da Silva",
    email: "jose@example.com",
    firstName: "José",
    lastName: "da Silva",
    cpf: "24301457030",
  },
  USER_ID,
);

export const OTHER_USER = User.create(
  {
    name: "Maria Souza",
    email: "maria@example.com",
    firstName: "Maria",
    lastName: "Souza",
    cpf: "52998224725",
  },
  OTHER_USER_ID,
);

export const FRESH_USER = User.create({
  name: "Felipe Rocha",
  email: "felipe@example.com",
  firstName: "Felipe",
  lastName: "Rocha",
  cpf: "11144477735",
});

export const USERS = [USER, OTHER_USER];
export const USER_IDS = [USER_ID, OTHER_USER_ID];

export const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

export const UPDATED_USER = User.create(
  {
    name: "José da Silva Junior",
    email: USER.email,
    firstName: USER.firstName,
    lastName: "da Silva Junior",
    cpf: USER.cpf,
  },
  USER_ID,
);

export async function seedUserById(id: string): Promise<User> {
  const REPOSITORY = new UserRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
  if (EXISTING) return EXISTING;

  const FIXTURE = id === USER_ID ? USER : OTHER_USER;

  await db.insert(user).values({
    id: FIXTURE.id,
    name: FIXTURE.name,
    email: FIXTURE.email,
    firstName: FIXTURE.firstName,
    lastName: FIXTURE.lastName,
    cpf: FIXTURE.cpf,
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
