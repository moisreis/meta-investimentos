import Decimal from "decimal.js";
import type { Application } from "@/business/entities/portfolio/application.entity";
import type { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents an application with its remaining poolable quota quantity
 * after accounting for allocations already consumed by withdrawals.
 */
export interface RemainingApplication {
  id: EntityId;
  quotas: QuotaQuantity;
}

/**
 * Computes the remaining poolable quota quantity per application.
 *
 * For each application, the quantity already allocated to withdrawals
 * (through `TransactionAllocation` records) is subtracted from the
 * application's original quota quantity. Only non-reversed applications
 * contribute quota quantity.
 *
 * @param applications - The applications of the position, ordered
 *   oldest-first.
 * @param allocations - The existing transaction allocations of the
 *   position.
 * @returns The remaining quota quantity per application.
 */
export function computeRemainingApplicationQuotas(
  applications: Application[],
  allocations: TransactionAllocation[],
): RemainingApplication[] {
  const consumedByApplication = new Map<EntityId, Decimal>();

  for (const allocation of allocations) {
    consumedByApplication.set(
      allocation.applicationId,
      (
        consumedByApplication.get(allocation.applicationId) ?? new Decimal(0)
      ).plus(allocation.quotasConsumed.value),
    );
  }

  const result: RemainingApplication[] = [];

  for (const application of applications) {
    if (application.reversedAt !== null) {
      continue;
    }

    const consumed =
      consumedByApplication.get(application.id as EntityId) ?? new Decimal(0);
    const remaining = application.quotas.value.minus(consumed);

    if (remaining.lte(0)) {
      continue;
    }

    result.push({
      id: application.id as EntityId,
      quotas: QuotaQuantity.create(remaining),
    });
  }

  return result;
}
