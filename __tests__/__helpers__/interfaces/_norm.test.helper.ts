import { Norm } from "@/business/entities/portfolio/norm.entity";
import type { INorm } from "@/business/interfaces/portfolio/norm.interface";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

export const NORM_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const CATEGORY_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const OTHER_CATEGORY_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";

export const NORM = Norm.create(
  {
    articleNumber: "Art. 12",
    name: "Limite de Concentração",
    categoryId: CATEGORY_ID,
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  NORM_ID,
);

export function createInMemoryNormRepository(): INorm {
  const ROWS = new Map<string, Norm>();

  return {
    async findById(id: string): Promise<Norm | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByCategoryId(categoryId: string): Promise<Norm[]> {
      const MATCHES: Norm[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.categoryId === categoryId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async save(norm: Norm): Promise<Norm> {
      ROWS.set(norm.id ?? "generated-id", norm);

      return norm;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
