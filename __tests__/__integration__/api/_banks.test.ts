import { eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { ID } from "@/__tests__/__fixtures__";
import { installApiTestRuntime } from "@/__tests__/__helpers__/api/_api.test.runtime";
import { seedUserById } from "@/__tests__/__seeds__/_user.seed";
import {
  closeDatabase,
  db,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import {
  GET as getBank,
  PATCH as updateBank,
} from "@/app/api/banks/[bankId]/route";
import { POST as createBank, GET as listBanks } from "@/app/api/banks/route";
import type { ResolvedActor } from "@/business/use-cases/shared/actor-resolution";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { auditLog, user } from "@/infrastructure/database/schemas";

const CITY_USER: ResolvedActor = {
  actorId: EntityId.create(ID.USER.DEFAULT),
  role: "USER",
};

const MANAGER: ResolvedActor = {
  actorId: EntityId.create(ID.USER.DEFAULT),
  role: "MANAGER",
};

describe("API banks", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("creates a bank and returns its DTO", async () => {
    installApiTestRuntime();
    await seedUserById(ID.USER.DEFAULT);

    const response = await createBank(
      new Request("http://localhost/api/banks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "341", name: "Itaú" }),
      }),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(201);
    const { data } = await response.json();
    expect(data.code).toBe("341");
    expect(data.name).toBe("Itaú");
    expect(data.id).toBeTypeOf("string");
  });

  it("record an audit log entry for a created bank", async () => {
    installApiTestRuntime({ actor: CITY_USER });
    await seedUserById(ID.USER.DEFAULT);

    await createBank(
      new Request("http://localhost/api/banks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "341", name: "Itaú" }),
      }),
      { params: Promise.resolve({}) },
    );

    const logs = await db.select().from(auditLog);
    expect(logs).toHaveLength(1);
    expect(logs[0].entity).toBe("Bank");
    expect(logs[0].action).toBe("CREATED");
    expect(logs[0].userId).toBe(ID.USER.DEFAULT);
  });

  it("lists banks with pagination metadata", async () => {
    installApiTestRuntime();
    await seedUserById(ID.USER.DEFAULT);

    for (let i = 1; i <= 3; i += 1) {
      await createBank(
        new Request("http://localhost/api/banks", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ code: `00${i}`, name: `Bank ${i}` }),
        }),
        { params: Promise.resolve({}) },
      );
    }

    const response = await listBanks(
      new Request("http://localhost/api/banks?page=1&pageSize=2"),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(200);
    const { data, meta } = await response.json();
    expect(data).toHaveLength(2);
    expect(meta).toMatchObject({ page: 1, pageSize: 2, totalItems: 2 });
  });

  it("retrieves a single bank", async () => {
    installApiTestRuntime();
    await seedUserById(ID.USER.DEFAULT);

    await createBank(
      new Request("http://localhost/api/banks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "341", name: "Itaú" }),
      }),
      { params: Promise.resolve({}) },
    );

    const listed = await listBanks(new Request("http://localhost/api/banks"), {
      params: Promise.resolve({}),
    });
    const { data: banks } = await listed.json();
    const bankId = banks[0].id;

    const response = await getBank(
      new Request(`http://localhost/api/banks/${bankId}`),
      { params: Promise.resolve({ bankId }) },
    );

    expect(response.status).toBe(200);
    const { data } = await response.json();
    expect(data.code).toBe("341");
  });

  it("allows a manager to update a bank", async () => {
    installApiTestRuntime({ actor: MANAGER });
    await seedUserById(ID.USER.DEFAULT);
    await db
      .update(user)
      .set({ role: "MANAGER" })
      .where(eq(user.id, ID.USER.DEFAULT));

    await createBank(
      new Request("http://localhost/api/banks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "341", name: "Itaú" }),
      }),
      { params: Promise.resolve({}) },
    );

    const listed = await listBanks(new Request("http://localhost/api/banks"), {
      params: Promise.resolve({}),
    });
    const { data: banks } = await listed.json();
    const bankId = banks[0].id;

    const response = await updateBank(
      new Request(`http://localhost/api/banks/${bankId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Itaú Unibanco" }),
      }),
      { params: Promise.resolve({ bankId }) },
    );

    expect(response.status).toBe(200);
    const { data } = await response.json();
    expect(data.name).toBe("Itaú Unibanco");
  });

  it("rejects a non-manager updating a bank with 404", async () => {
    installApiTestRuntime({ actor: CITY_USER });
    await seedUserById(ID.USER.DEFAULT);

    await createBank(
      new Request("http://localhost/api/banks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "341", name: "Itaú" }),
      }),
      { params: Promise.resolve({}) },
    );

    const listed = await listBanks(new Request("http://localhost/api/banks"), {
      params: Promise.resolve({}),
    });
    const { data: banks } = await listed.json();
    const bankId = banks[0].id;

    const response = await updateBank(
      new Request(`http://localhost/api/banks/${bankId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Itaú Unibanco" }),
      }),
      { params: Promise.resolve({ bankId }) },
    );

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("validates the create payload", async () => {
    installApiTestRuntime();

    const response = await createBank(
      new Request("http://localhost/api/banks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "", name: "" }),
      }),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("INVALID_ARGUMENT");
    expect(body.error.details.issues.length).toBeGreaterThan(0);
  });
});
