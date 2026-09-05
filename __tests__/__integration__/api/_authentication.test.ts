import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { installApiTestRuntime } from "@/__tests__/__helpers__/api/_api.test.runtime";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { POST as createBank, GET as listBanks } from "@/app/api/banks/route";

describe("API authentication", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("rejects unauthenticated list requests with 401", async () => {
    installApiTestRuntime({ actor: null });

    const response = await listBanks(
      new Request("http://localhost/api/banks"),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe("UNAUTHENTICATED");
  });

  it("rejects unauthenticated mutations with 401", async () => {
    installApiTestRuntime({ actor: null });

    const response = await createBank(
      new Request("http://localhost/api/banks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "341", name: "Itaú" }),
      }),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe("UNAUTHENTICATED");
  });
});
