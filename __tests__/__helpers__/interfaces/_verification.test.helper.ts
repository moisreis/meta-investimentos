import { Verification } from "@/business/entities/user/verification.entity";
import type { IVerification } from "@/business/interfaces/user/verification.interface";

export const VERIFICATION_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const OTHER_VERIFICATION_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const EXPIRES_AT = new Date("2026-02-01T00:00:00.000Z");

export const VERIFICATION = Verification.create(
  {
    identifier: "reset-password:jose@example.com",
    value: "reset-token",
    expiresAt: EXPIRES_AT,
  },
  VERIFICATION_ID,
);

export const OTHER_VERIFICATION = Verification.create(
  {
    identifier: "reset-password:maria@example.com",
    value: "other-reset-token",
    expiresAt: EXPIRES_AT,
  },
  OTHER_VERIFICATION_ID,
);

export function createInMemoryVerificationRepository(): IVerification {
  const ROWS = new Map<string, Verification>();

  return {
    async findById(id: string): Promise<Verification | null> {
      return ROWS.get(id) ?? null;
    },
    async findAllByIdentifier(identifier: string): Promise<Verification[]> {
      const MATCHES: Verification[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.identifier === identifier) MATCHES.push(ROW);
      }

      return MATCHES;
    },
    async save(verification: Verification): Promise<Verification> {
      ROWS.set(verification.id ?? "generated-id", verification);

      return verification;
    },
    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
