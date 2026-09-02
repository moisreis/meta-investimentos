import {
  APPLICATION_ID,
  OTHER_APPLICATION_ID,
  OTHER_WITHDRAWAL_ID,
  WITHDRAWAL_ID,
} from "@/__tests__/__fixtures__";
import { seedApplicationById } from "./_application.seed";
import { seedWithdrawalById } from "./_withdrawal.seed";

export async function seedTransactionContext(): Promise<void> {
  await seedApplicationById(APPLICATION_ID);
  await seedApplicationById(OTHER_APPLICATION_ID);
  await seedWithdrawalById(WITHDRAWAL_ID);
  await seedWithdrawalById(OTHER_WITHDRAWAL_ID);
}
