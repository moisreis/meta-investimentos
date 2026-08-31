import {
  APPLICATION_ID,
  OTHER_APPLICATION_ID,
  seedApplicationById,
} from "./_application.seed";
import {
  OTHER_WITHDRAWAL_ID,
  seedWithdrawalById,
  WITHDRAWAL_ID,
} from "./_withdrawal.seed";

export async function seedTransactionContext(): Promise<void> {
  await seedApplicationById(APPLICATION_ID);
  await seedApplicationById(OTHER_APPLICATION_ID);
  await seedWithdrawalById(WITHDRAWAL_ID);
  await seedWithdrawalById(OTHER_WITHDRAWAL_ID);
}
