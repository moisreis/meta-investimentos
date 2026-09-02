import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IApplication } from "@/business/interfaces/portfolio/application.interface";

export {
  APPLICATION,
  APPLICATION_DATE,
  APPLICATION_ID,
  APPLICATION_SUM_AMOUNT,
  APPLICATION_SUM_QUOTAS,
  APPLICATIONS,
  EXTERNAL_APPLICATION,
  EXTERNAL_APPLICATION_ID,
  FRESH_APPLICATION,
  OTHER_APPLICATION,
  OTHER_APPLICATION_DATE,
  OTHER_APPLICATION_ID,
  OTHER_POSITION_ID,
  PERIOD_OUTSIDE_APPLICATION,
  PERIOD_OUTSIDE_APPLICATION_ID,
  POSITION_ID,
  UPDATED_APPLICATION,
} from "@/__tests__/__fixtures__";

export function createInMemoryApplicationRepository(): IApplication {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IApplication["save"]>>
  >({ extractId: (a) => a.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPositionId(positionId) {
      return BASE.match((a) => a.positionId === positionId);
    },
    async findAllByPositionIdInPeriod(positionId, startDate, endDate) {
      return BASE.match(
        (a) =>
          a.positionId === positionId &&
          a.date.getTime() >= startDate.getTime() &&
          a.date.getTime() <= endDate.getTime(),
      );
    },
    save: (application) => BASE.save(application),
    delete: (id) => BASE.delete(id),
  };
}
