import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IWithdrawal } from "@/business/interfaces/portfolio/withdrawal.interface";

export {
  EXTERNAL_WITHDRAWAL,
  EXTERNAL_WITHDRAWAL_ID,
  FRESH_WITHDRAWAL,
  OTHER_POSITION_ID,
  OTHER_WITHDRAWAL,
  OTHER_WITHDRAWAL_DATE,
  OTHER_WITHDRAWAL_ID,
  PERIOD_OUTSIDE_WITHDRAWAL,
  PERIOD_OUTSIDE_WITHDRAWAL_ID,
  POSITION_ID,
  UPDATED_WITHDRAWAL,
  WITHDRAWAL,
  WITHDRAWAL_DATE,
  WITHDRAWAL_ID,
  WITHDRAWAL_SUM_AMOUNT,
  WITHDRAWAL_SUM_QUOTAS,
  WITHDRAWALS,
} from "@/__tests__/__fixtures__";

export function createInMemoryWithdrawalRepository(): IWithdrawal {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IWithdrawal["save"]>>
  >({ extractId: (w) => w.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPositionId(positionId) {
      return BASE.match((w) => w.positionId === positionId);
    },
    async findAllByPositionIdInPeriod(positionId, startDate, endDate) {
      return BASE.match(
        (w) =>
          w.positionId === positionId &&
          w.date.getTime() >= startDate.getTime() &&
          w.date.getTime() <= endDate.getTime(),
      );
    },
    save: (withdrawal) => BASE.save(withdrawal),
    delete: (id) => BASE.delete(id),
  };
}
