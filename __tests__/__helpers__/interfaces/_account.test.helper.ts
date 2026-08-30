import { Account } from "@/business/entities/user/account.entity";
import type { IAccount } from "@/business/interfaces/user/account.interface";

export const ACCOUNT_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const OTHER_ACCOUNT_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const USER_ID = "9f5d9a1b-2c6e-4a3b-9c1d-3e2f4a6b8c0d";
export const OTHER_USER_ID = "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d";

export const ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat",
    userId: USER_ID,
  },
  ACCOUNT_ID,
);

export const OTHER_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octodog",
    userId: OTHER_USER_ID,
  },
  OTHER_ACCOUNT_ID,
);

export function createInMemoryAccountRepository(): IAccount {
  const ROWS = new Map<string, Account>();

  return {
    async findById(id: string): Promise<Account | null> {
      return ROWS.get(id) ?? null;
    },
    async findByIssuerAndAccountId(
      issuer: string,
      accountId: string,
    ): Promise<Account | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.issuer === issuer && ROW.accountId === accountId) return ROW;
      }

      return null;
    },
    async findAllByUserId(userId: string): Promise<Account[]> {
      const MATCHES: Account[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.userId === userId) MATCHES.push(ROW);
      }

      return MATCHES;
    },
    async save(account: Account): Promise<Account> {
      ROWS.set(account.id ?? "generated-id", account);

      return account;
    },
    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
