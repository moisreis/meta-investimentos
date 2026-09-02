import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IBank } from "@/business/interfaces/bank/bank.interface";

export {
  BANK,
  BANK_ID,
  FRESH_BANK,
  OTHER_BANK,
  OTHER_BANK_ID,
  UPDATED_BANK,
} from "@/__tests__/__fixtures__";

export function createInMemoryBankRepository(): IBank {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IBank["save"]>>>({
    extractId: (b) => b.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findByCode(code) {
      return BASE.findOne((b) => b.code === code);
    },
    save: (bank) => BASE.save(bank),
    delete: (id) => BASE.delete(id),
  };
}
