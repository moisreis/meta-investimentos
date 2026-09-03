import Decimal from "decimal.js";

import { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents an application that holds poolable quota quantity.
 */
export interface AvailableApplication {
  id: EntityId;
  quotas: QuotaQuantity;
}

/**
 * Allocates a withdrawal's quota quantity across applications in FIFO
 * order.
 *
 * Applications are consumed oldest-first. Each allocation record
 * references an application and the quantity consumed from it. When the
 * remaining quantity to allocate reaches zero, the allocation stops.
 *
 * @param applications - The available applications, ordered
 *   oldest-first, with their poolable quota quantities.
 * @param withdrawalId - The id of the withdrawal to allocate for.
 * @param withdrawalQuotas - The total quota quantity of the withdrawal.
 * @returns The `TransactionAllocation` records to persist.
 */
export function allocateWithdrawalQuotasFifo(
  applications: AvailableApplication[],
  withdrawalId: EntityId,
  withdrawalQuotas: QuotaQuantity,
): TransactionAllocation[] {
  const allocations: TransactionAllocation[] = [];
  let remaining = withdrawalQuotas.value;

  for (const application of applications) {
    if (remaining.lte(0)) {
      break;
    }

    const available = application.quotas.value;

    if (available.lte(0)) {
      continue;
    }

    const consumed = Decimal.min(remaining, available);

    allocations.push(
      TransactionAllocation.create({
        applicationId: application.id,
        withdrawId: withdrawalId,
        quotasConsumed: QuotaQuantity.create(consumed),
      }),
    );

    remaining = remaining.minus(consumed);
  }

  return allocations;
}
