import { describe, expect, it } from "vitest";

import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";

describe("Benchmark.create", () => {
  const VALID_PROPS = {
    acronym: "IBOV",
    name: "Ibovespa",
  };

  it("creates a valid benchmark with default values", () => {
    const BENCHMARK = Benchmark.create(VALID_PROPS);

    expect(BENCHMARK.id).toBeUndefined();
    expect(BENCHMARK.acronym).toBe("IBOV");
    expect(BENCHMARK.name).toBe("Ibovespa");
    expect(BENCHMARK.createdAt).toBeInstanceOf(Date);
  });

  it("creates a benchmark with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const BENCHMARK = Benchmark.create(VALID_PROPS, ID);

    expect(BENCHMARK.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");

    const BENCHMARK = Benchmark.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
    });

    expect(BENCHMARK.createdAt).toBe(CREATED_AT);
  });

  it("throws when the acronym is blank", () => {
    expect(() => Benchmark.create({ ...VALID_PROPS, acronym: " " })).toThrow(
      "Benchmark must have an acronym.",
    );
  });

  it("throws when the name is blank", () => {
    expect(() => Benchmark.create({ ...VALID_PROPS, name: "" })).toThrow(
      "Benchmark must have a name.",
    );
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Benchmark.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Benchmark.equals", () => {
  const VALID_PROPS = {
    acronym: "IBOV",
    name: "Ibovespa",
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const BENCHMARK = Benchmark.create(VALID_PROPS, ID);

    expect(BENCHMARK.equals(BENCHMARK)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Benchmark.create(VALID_PROPS, ID);
    const B = Benchmark.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Benchmark.create(VALID_PROPS, ID);
    const B = Benchmark.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Benchmark.create(VALID_PROPS, ID);
    const B = Benchmark.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const BENCHMARK = Benchmark.create(VALID_PROPS, ID);

    expect(BENCHMARK.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const BENCHMARK = Benchmark.create(VALID_PROPS, ID);

    expect(BENCHMARK.equals(undefined)).toBe(false);
  });
});
