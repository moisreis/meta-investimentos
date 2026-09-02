import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IFund } from "@/business/interfaces/fund/fund.interface";

export {
  FRESH_FUND,
  FUND,
  FUND_ID,
  OTHER_FUND,
  OTHER_FUND_ID,
  UPDATED_FUND,
} from "@/__tests__/__fixtures__";

export function createInMemoryFundRepository(): IFund {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IFund["save"]>>>({
    extractId: (f) => f.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findByCnpj(cnpj) {
      return BASE.findOne((f) => f.cnpj.value === cnpj);
    },
    save: (fund) => BASE.save(fund),
    delete: (id) => BASE.delete(id),
  };
}
