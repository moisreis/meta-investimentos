import AdmZip from "adm-zip";
import { beforeEach, describe, expect, it } from "vitest";

import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Fund } from "@/business/entities/fund/fund.entity";
import { runCvmImport } from "@/business/use-cases/cvm/run-cvm-import.uc";
import { CNPJ } from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";

class FakeCvmClient {
  readonly baseUrl = "https://fake.cvm.example";

  constructor(
    private readonly fetch: (
      year: number,
      month: number,
    ) => Promise<Buffer | null>,
  ) {}

  async fetchMonthlyFile(year: number, month: number): Promise<Buffer | null> {
    return this.fetch(year, month);
  }
}

function makeZip(csvContent: string): Buffer {
  const ZIP = new AdmZip();
  ZIP.addFile("inf_diario_fi_202401.csv", Buffer.from(csvContent, "utf8"));
  return ZIP.toBuffer();
}

const CSV =
  "CNPJ_FUNDO_CLASSE;DT_COMPTC;VL_QUOTA\n" +
  "12.345.678/0001-95;2024-01-31;10.5000\n" +
  "12.345.678/0001-95;2024-02-29;10.7000\n";

const UNKNOWN_CNPJ_CSV =
  "CNPJ_FUNDO_CLASSE;DT_COMPTC;VL_QUOTA\n" +
  "99.999.999/0001-99;2024-01-31;10.5000\n";

const FUND_CNPJ = "12345678000195";

function seedFund(unitOfWork: FakeUnitOfWork): void {
  unitOfWork.seed({
    funds: [
      Fund.create(
        {
          cnpj: CNPJ.create(FUND_CNPJ),
          name: "Fundo Ações",
          bankId: EntityId.create("2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f"),
        },
        "8c9d0e1f-2a3b-4c4d-9e5f-6a7b8c9d0e1f",
      ),
    ],
  });
}

describe("runCvmImport", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  it("imports matching quotas and finalizes with SUCCESS", async () => {
    seedFund(unitOfWork);

    const CLIENT = new FakeCvmClient(async (year, month) => {
      if (year === 2024 && month === 1) return makeZip(CSV);
      return null;
    });

    const RESULT = await runCvmImport(
      {
        funds: unitOfWork.funds,
        quotas: unitOfWork.quotas,
        cvmImports: unitOfWork.cvmImports,
        quotaImports: unitOfWork.quotaImports,
      },
      {
        client: CLIENT as never,
        requestedStart: new Date("2024-01-01"),
        requestedEnd: new Date("2024-01-31"),
        monthsBack: 1,
      },
    );

    expect(RESULT.status).toBe("SUCCESS");
    expect(RESULT.recordsImported).toBeGreaterThan(0);
  });

  it("skips records whose CNPJ does not match a known fund", async () => {
    seedFund(unitOfWork);

    const CLIENT = new FakeCvmClient(async (year, month) => {
      if (year === 2024 && month === 1) return makeZip(UNKNOWN_CNPJ_CSV);
      return null;
    });

    const RESULT = await runCvmImport(
      {
        funds: unitOfWork.funds,
        quotas: unitOfWork.quotas,
        cvmImports: unitOfWork.cvmImports,
        quotaImports: unitOfWork.quotaImports,
      },
      {
        client: CLIENT as never,
        requestedStart: new Date("2024-01-01"),
        requestedEnd: new Date("2024-01-31"),
        monthsBack: 1,
      },
    );

    expect(RESULT.status).toBe("SUCCESS");
    expect(RESULT.recordsImported).toBe(0);
    expect(RESULT.recordsSkipped).toBe(1);
  });

  it("finalizes with FAILED when no matching funds exist", async () => {
    const CLIENT = new FakeCvmClient(async () => makeZip(CSV));

    const RESULT = await runCvmImport(
      {
        funds: unitOfWork.funds,
        quotas: unitOfWork.quotas,
        cvmImports: unitOfWork.cvmImports,
        quotaImports: unitOfWork.quotaImports,
      },
      {
        client: CLIENT as never,
        requestedStart: new Date("2024-01-01"),
        requestedEnd: new Date("2024-01-31"),
        monthsBack: 1,
      },
    );

    expect(RESULT.status).toBe("FAILED");
  });
});
