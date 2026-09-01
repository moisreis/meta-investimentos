import { Fund } from "@/business/entities/fund/fund.entity";
import type { IFund } from "@/business/interfaces/fund/fund.interface";
import CNPJ from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";

export const FUND_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

export const FUND = Fund.create(
  {
    cnpj: CNPJ.create("12345678000195"),
    name: "Fundo Teste",
    bankId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
  },
  FUND_ID,
);

export function createInMemoryFundRepository(): IFund {
  const ROWS = new Map<string, Fund>();

  return {
    async findById(id: string): Promise<Fund | null> {
      return ROWS.get(id) ?? null;
    },

    async findByCnpj(cnpj: string): Promise<Fund | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.cnpj.value === cnpj) return ROW;
      }

      return null;
    },

    async save(fund: Fund): Promise<Fund> {
      ROWS.set(fund.id ?? "generated-id", fund);

      return fund;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
