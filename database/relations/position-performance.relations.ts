import { defineRelations } from "drizzle-orm";
import { position, positionPerformance } from "@db-schemas";

// Defines the relations for the `position_performance` table.
// Links a performance record to its position.
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
