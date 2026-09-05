import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { ID } from "@/__tests__/__fixtures__";
import { installApiTestRuntime } from "@/__tests__/__helpers__/api/_api.test.runtime";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { GET as getBank } from "@/app/api/banks/[bankId]/route";
import { POST as createBank } from "@/app/api/banks/route";

describe("API error mapping", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("maps an invalid route parameter to 400 INVALID_ARGUMENT", async () => {
    installApiTestRuntime();

    const response = await getBank(
      new Request("http://localhost/api/banks/not-a-uuid"),
      { params: Promise.resolve({ bankId: "not-a-uuid" }) },
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("INVALID_ARGUMENT");
  });

  it("maps a missing resource to 404 NOT_FOUND", async () => {
    installApiTestRuntime();

    const response = await getBank(
      new Request(`http://localhost/api/banks/${ID.BANK.OTHER}`),
      { params: Promise.resolve({ bankId: ID.BANK.OTHER }) },
    );

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("maps a malformed JSON body to 400 INVALID_JSON", async () => {
    installApiTestRuntime();

    const response = await createBank(
      new Request("http://localhost/api/banks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{not json",
      }),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("INVALID_JSON");
  });
});
