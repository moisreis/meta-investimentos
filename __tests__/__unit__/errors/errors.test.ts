import { describe, expect, it } from "vitest";

import {
  ConcurrencyError,
  DomainError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors";

describe("DomainError", () => {
  it("is an instance of Error", () => {
    const ERROR = new DomainError("A business rule was violated.");

    expect(ERROR).toBeInstanceOf(Error);
    expect(ERROR).toBeInstanceOf(DomainError);
  });

  it("carries the provided message", () => {
    const ERROR = new DomainError("A business rule was violated.");

    expect(ERROR.message).toBe("A business rule was violated.");
  });

  it("defaults its name to DomainError", () => {
    const ERROR = new DomainError("A business rule was violated.");

    expect(ERROR.name).toBe("DomainError");
  });

  it("exposes a stack trace", () => {
    const ERROR = new DomainError("A business rule was violated.");

    expect(ERROR.stack).toBeDefined();
  });
});

describe("ValidationError", () => {
  it("extends DomainError", () => {
    const ERROR = new ValidationError("The amount must be positive.");

    expect(ERROR).toBeInstanceOf(DomainError);
    expect(ERROR).toBeInstanceOf(Error);
  });

  it("carries the provided message", () => {
    const ERROR = new ValidationError("The amount must be positive.");

    expect(ERROR.message).toBe("The amount must be positive.");
  });

  it("defaults its name to ValidationError", () => {
    const ERROR = new ValidationError("The amount must be positive.");

    expect(ERROR.name).toBe("ValidationError");
  });
});

describe("NotFoundError", () => {
  it("extends DomainError", () => {
    const ERROR = new NotFoundError("Position with id abc was not found.");

    expect(ERROR).toBeInstanceOf(DomainError);
    expect(ERROR).toBeInstanceOf(Error);
  });

  it("carries the provided message", () => {
    const ERROR = new NotFoundError("Position with id abc was not found.");

    expect(ERROR.message).toBe("Position with id abc was not found.");
  });

  it("defaults its name to NotFoundError", () => {
    const ERROR = new NotFoundError("Position with id abc was not found.");

    expect(ERROR.name).toBe("NotFoundError");
  });
});

describe("ConcurrencyError", () => {
  it("extends DomainError", () => {
    const ERROR = new ConcurrencyError(
      "Position with id abc was modified by another operation.",
    );

    expect(ERROR).toBeInstanceOf(DomainError);
    expect(ERROR).toBeInstanceOf(Error);
  });

  it("carries the provided message", () => {
    const ERROR = new ConcurrencyError(
      "Position with id abc was modified by another operation.",
    );

    expect(ERROR.message).toBe(
      "Position with id abc was modified by another operation.",
    );
  });

  it("defaults its name to ConcurrencyError", () => {
    const ERROR = new ConcurrencyError(
      "Position with id abc was modified by another operation.",
    );

    expect(ERROR.name).toBe("ConcurrencyError");
  });
});

describe("Shared error hierarchy", () => {
  const ERROR_CLASSES = [
    { ErrorClass: ValidationError, name: "ValidationError" },
    { ErrorClass: NotFoundError, name: "NotFoundError" },
    { ErrorClass: ConcurrencyError, name: "ConcurrencyError" },
  ] as const;

  for (const { ErrorClass, name } of ERROR_CLASSES) {
    it(`treats ${name} as a DomainError but not as the sibling subclasses`, () => {
      const ERROR = new ErrorClass(`${name} was raised.`);

      expect(ERROR).toBeInstanceOf(DomainError);

      for (const OTHER of ERROR_CLASSES) {
        if (OTHER.ErrorClass === ErrorClass) {
          continue;
        }

        expect(ERROR).not.toBeInstanceOf(OTHER.ErrorClass);
      }
    });
  }

  it("distinguishes between the specific subclasses", () => {
    const VALIDATION = new ValidationError("Invalid input.");
    const NOT_FOUND = new NotFoundError("Not found.");
    const CONCURRENCY = new ConcurrencyError("Conflict.");

    expect(VALIDATION).toBeInstanceOf(ValidationError);
    expect(NOT_FOUND).toBeInstanceOf(NotFoundError);
    expect(CONCURRENCY).toBeInstanceOf(ConcurrencyError);

    expect(NOT_FOUND).not.toBeInstanceOf(ValidationError);
    expect(CONCURRENCY).not.toBeInstanceOf(NotFoundError);
  });
});
