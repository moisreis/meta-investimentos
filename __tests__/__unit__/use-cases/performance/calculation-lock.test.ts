import { describe, expect, it } from "vitest";

import { withCalculationLock } from "@/business/use-cases/performance/calculation-lock";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("withCalculationLock", () => {
  it("serializes concurrent workers targeting the same key", async () => {
    const EVENTS: string[] = [];

    const run = async (name: string, delay: number): Promise<void> => {
      await withCalculationLock("portfolio-A", async () => {
        EVENTS.push(`${name}:start`);
        await sleep(delay);
        EVENTS.push(`${name}:end`);
      });
    };

    await Promise.all([run("first", 30), run("second", 0)]);

    expect(EVENTS).toEqual([
      "first:start",
      "first:end",
      "second:start",
      "second:end",
    ]);
  });

  it("does not block workers targeting different keys", async () => {
    const EVENTS: string[] = [];

    const run = async (key: string, name: string): Promise<void> => {
      await withCalculationLock(key, async () => {
        EVENTS.push(`${name}:start`);
        await sleep(20);
        EVENTS.push(`${name}:end`);
      });
    };

    await Promise.all([run("portfolio-A", "a"), run("portfolio-B", "b")]);

    expect(EVENTS).toEqual(["a:start", "b:start", "a:end", "b:end"]);
  });

  it("keeps the lock chain alive after a failure", async () => {
    let attempts = 0;

    await withCalculationLock("portfolio-C", async () => {
      attempts += 1;
      throw new Error("boom");
    }).catch(() => undefined);

    await withCalculationLock("portfolio-C", async () => {
      attempts += 1;
    });

    expect(attempts).toBe(2);
  });

  it("resolves the worker's value", async () => {
    const VALUE = await withCalculationLock("portfolio-D", async () => 42);
    expect(VALUE).toBe(42);
  });
});
