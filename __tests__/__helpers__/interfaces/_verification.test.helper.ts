import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IVerification } from "@/business/interfaces/user/verification.interface";

export {
  EXPIRES_AT,
  FRESH_VERIFICATION,
  OTHER_VERIFICATION,
  OTHER_VERIFICATION_ID,
  SECOND_VERIFICATION,
  SECOND_VERIFICATION_ID,
  UPDATED_VERIFICATION,
  VERIFICATION,
  VERIFICATION_ID,
} from "@/__tests__/__fixtures__";

export function createInMemoryVerificationRepository(): IVerification {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IVerification["save"]>>
  >({ extractId: (v) => v.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByIdentifier(identifier) {
      return BASE.match((v) => v.identifier === identifier);
    },
    save: (verification) => BASE.save(verification),
    delete: (id) => BASE.delete(id),
  };
}
