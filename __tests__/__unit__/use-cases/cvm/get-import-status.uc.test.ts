import { beforeEach, describe, expect, it } from "vitest";

import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { CvmImport } from "@/business/entities/cvm/cvm-import.entity";
import {
  getFailedImports,
  getLatestImport,
} from "@/business/use-cases/cvm/get-import-status.uc";

function makeImport(
  id: string,
  status: CvmImport["status"],
  startedAt: Date,
): CvmImport {
  return CvmImport.create(
    {
      source: "CVM",
      status,
      requestedStart: new Date("2024-01-01"),
      requestedEnd: new Date("2024-12-31"),
      monthsBack: 12,
      filesFound: 0,
      filesDownloaded: 0,
      filesUnavailable: 0,
      recordsMatched: 0,
      recordsImported: 0,
      recordsUpserted: 0,
      recordsSkipped: 0,
      startedAt,
    },
    id,
  );
}

describe("getLatestImport", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  it("returns null when no import has been recorded", async () => {
    const RESULT = await getLatestImport(unitOfWork.cvmImports);

    expect(RESULT).toBeNull();
  });

  it("returns the most recent import by startedAt", async () => {
    unitOfWork.seed({
      cvmImports: [
        makeImport(
          "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
          "SUCCESS",
          new Date("2024-01-01"),
        ),
        makeImport(
          "1b2c3d4e-5f6a-4b7c-9d8e-0f1a2b3c4d5e",
          "SUCCESS",
          new Date("2024-06-01"),
        ),
      ],
    });

    const RESULT = await getLatestImport(unitOfWork.cvmImports);

    expect(RESULT?.startedAt).toEqual(new Date("2024-06-01"));
  });
});

describe("getFailedImports", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  it("returns only failed imports", async () => {
    unitOfWork.seed({
      cvmImports: [
        makeImport(
          "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
          "FAILED",
          new Date("2024-01-01"),
        ),
        makeImport(
          "1b2c3d4e-5f6a-4b7c-9d8e-0f1a2b3c4d5e",
          "SUCCESS",
          new Date("2024-06-01"),
        ),
      ],
    });

    const RESULT = await getFailedImports(unitOfWork.cvmImports);

    expect(RESULT).toHaveLength(1);
    expect(RESULT[0].status).toBe("FAILED");
  });

  it("respects the limit", async () => {
    unitOfWork.seed({
      cvmImports: [
        makeImport(
          "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
          "FAILED",
          new Date("2024-01-01"),
        ),
        makeImport(
          "1b2c3d4e-5f6a-4b7c-9d8e-0f1a2b3c4d5e",
          "FAILED",
          new Date("2024-06-01"),
        ),
        makeImport(
          "2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f",
          "FAILED",
          new Date("2024-12-01"),
        ),
      ],
    });

    const RESULT = await getFailedImports(unitOfWork.cvmImports, 2);

    expect(RESULT).toHaveLength(2);
  });

  it("returns an empty array when there are no failed imports", async () => {
    unitOfWork.seed({
      cvmImports: [
        makeImport(
          "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
          "SUCCESS",
          new Date("2024-01-01"),
        ),
      ],
    });

    const RESULT = await getFailedImports(unitOfWork.cvmImports);

    expect(RESULT).toEqual([]);
  });
});
