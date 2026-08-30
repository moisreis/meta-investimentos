import { defineRelations } from "drizzle-orm";
import { position, positionPerformance } from "../../schemas";

/**
 * Defines the relations applicable to the `position_performance`
 * table.
 *
 * A performance record always belongs to exactly one {@link
 * position}, linked through the `positionId` foreign key.
 */
export const positionPerformanceRelations = defineRelations(
  { position, positionPerformance },
  (r) => ({
    positionPerformance: {
      position: r.one.position({
        from: r.positionPerformance.positionId,
        to: r.position.id,
      }),
    },
  }),
);
