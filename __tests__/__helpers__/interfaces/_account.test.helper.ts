import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IAccount } from "@/business/interfaces/user/account.interface";

export {
  ACCOUNT,
  ACCOUNT_ID,
  FRESH_ACCOUNT,
  OTHER_ACCOUNT,
  OTHER_ACCOUNT_ID,
  OTHER_USER_ID,
  UPDATED_ACCOUNT,
  USER_ID,
} from "@/__tests__/__fixtures__";

export function createInMemoryAccountRepository(): IAccount {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IAccount["save"]>>>({
    extractId: (a) => a.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findByIssuerAndAccountId(issuer, accountId) {
      return BASE.findOne(
        (a) => a.issuer === issuer && a.accountId === accountId,
      );
    },
    async findAllByUserId(userId) {
      return BASE.match((a) => a.userId === userId);
    },
    save: (account) => BASE.save(account),
    delete: (id) => BASE.delete(id),
  };
}
