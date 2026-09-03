import { ID } from "@/__tests__/__fixtures__";
import { seedApplicationById } from "./_application.seed";
import { seedWithdrawalById } from "./_withdrawal.seed";

/**
 * Seeds the transaction context required by allocation tests.
 *
 * The function seeds the default and alternate applications
 * and the default and alternate withdrawals. This ensures all
 * parent rows exist before allocation seeding runs.
 */
export async function seedTransactionContext(): Promise<void> {
  await seedApplicationById(ID.APPLICATION.DEFAULT);
  await seedApplicationById(ID.APPLICATION.OTHER);
  await seedWithdrawalById(ID.WITHDRAWAL.DEFAULT);
  await seedWithdrawalById(ID.WITHDRAWAL.OTHER);
}
