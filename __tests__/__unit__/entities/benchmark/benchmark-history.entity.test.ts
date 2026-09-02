import { describe, expect, it } from "vitest";

import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("BenchmarkHistory.create", () => {
  const DATE = new Date("2026-01-01T00:00:00.000Z");
  const VALID_PROPS = {
    benchmarkId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: DATE,
    rate: SignedPercentage.create("12.345"),
  };

  it("creates a valid benchmark history with default values", () => {
    const HISTORY = BenchmarkHistory.create(VALID_PROPS);

    expect(HISTORY.id).toBeUndefined();
    expect(HISTORY.benchmarkId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(HISTORY.date).toBe(DATE);
    expect(HISTORY.rate.value.toString()).toBe("12.35");
    expect(HISTORY.createdAt).toBeInstanceOf(Date);
  });

  it("creates a benchmark history with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const HISTORY = BenchmarkHistory.create(VALID_PROPS, ID);

    expect(HISTORY.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");

    const HISTORY = BenchmarkHistory.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
    });

    expect(HISTORY.createdAt).toBe(CREATED_AT);
  });

  it("throws when the benchmark id is blank", () => {
    expect(() =>
      BenchmarkHistory.create({
        ...VALID_PROPS,
        benchmarkId: " " as unknown as EntityId,
      }),
    ).toThrow("BenchmarkHistory must have a benchmark id.");
  });

  it("throws when the date is missing", () => {
    const { date: _, ...REST } = VALID_PROPS;

    expect(() =>
      BenchmarkHistory.create(
        REST as Parameters<typeof BenchmarkHistory.create>[0],
      ),
    ).toThrow("BenchmarkHistory must have a date.");
  });

  it("throws when the rate is missing", () => {
    const { rate: _, ...REST } = VALID_PROPS;

    expect(() =>
      BenchmarkHistory.create(
        REST as Parameters<typeof BenchmarkHistory.create>[0],
      ),
    ).toThrow("BenchmarkHistory must have a rate.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    BenchmarkHistory.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("BenchmarkHistory.equals", () => {
  const VALID_PROPS = {
    benchmarkId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    rate: SignedPercentage.create("12.345"),
  };
  const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("returns true for the same instance", () => {
    const HISTORY = BenchmarkHistory.create(VALID_PROPS, ID);

    expect(HISTORY.equals(HISTORY)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = BenchmarkHistory.create(VALID_PROPS, ID);
    const B = BenchmarkHistory.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = BenchmarkHistory.create(VALID_PROPS, ID);
    const B = BenchmarkHistory.create(
      VALID_PROPS,
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = BenchmarkHistory.create(VALID_PROPS, ID);
    const B = BenchmarkHistory.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const HISTORY = BenchmarkHistory.create(VALID_PROPS, ID);

    expect(HISTORY.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const HISTORY = BenchmarkHistory.create(VALID_PROPS, ID);

    expect(HISTORY.equals(undefined)).toBe(false);
  });
});
