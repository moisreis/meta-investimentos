import {
  EXTERNAL_POSITION_PERFORMANCE,
  EXTERNAL_POSITION_PERFORMANCE_ID,
  FEBRUARY_PERFORMANCE_DATE,
  FRESH_POSITION_PERFORMANCE,
  OTHER_POSITION_ID,
  OTHER_POSITION_PERFORMANCE,
  OTHER_POSITION_PERFORMANCE_ID,
  PERFORMANCE_DATE,
  PERFORMANCE_DUPLICATE_DATE,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID,
  POSITION_ID,
  POSITION_PERFORMANCE,
  POSITION_PERFORMANCE_ID,
  UPDATED_POSITION_PERFORMANCE,
} from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IPositionPerformance } from "@/business/interfaces/performance/position-performance.interface";

export {
  POSITION_PERFORMANCE_ID,
  OTHER_POSITION_PERFORMANCE_ID,
  EXTERNAL_POSITION_PERFORMANCE_ID,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID,
  POSITION_ID,
  OTHER_POSITION_ID,
  PERFORMANCE_DATE,
  PERFORMANCE_DUPLICATE_DATE,
  FEBRUARY_PERFORMANCE_DATE,
  POSITION_PERFORMANCE,
  OTHER_POSITION_PERFORMANCE,
  EXTERNAL_POSITION_PERFORMANCE,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE,
  UPDATED_POSITION_PERFORMANCE,
  FRESH_POSITION_PERFORMANCE,
};

export const PERFORMANCE_ID = POSITION_PERFORMANCE_ID;
export const PERFORMANCE = POSITION_PERFORMANCE;

export function createInMemoryPositionPerformanceRepository(): IPositionPerformance {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IPositionPerformance["save"]>>
  >({ extractId: (pp) => pp.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPositionId(positionId) {
      return BASE.match((pp) => pp.positionId === positionId);
    },
    async findByPositionIdAndDate(positionId, date) {
      return BASE.findOne(
        (pp) =>
          pp.positionId === positionId && pp.date.getTime() === date.getTime(),
      );
    },
    async findLatestByPositionId(positionId) {
      const FOUND = BASE.match((pp) => pp.positionId === positionId);

      if (FOUND.length === 0) return null;

      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    save: (positionPerformance) => BASE.save(positionPerformance),
    delete: (id) => BASE.delete(id),
  };
}
