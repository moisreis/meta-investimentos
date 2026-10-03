import { describe, it, expect, vi } from "vitest"
import {
  RequireSessionUser,
  type SessionUser,
} from "@/lib/auth/require-session"

// Mock the Better Auth client
vi.mock("@/clients/better-auth.client", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers()),
}))

import { auth } from "@/clients/better-auth.client"
import { headers } from "next/headers"

const MINIMAL_SESSION = {
  id: "session-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "user-1",
  expiresAt: new Date(Date.now() + 86400000),
  token: "token",
}

describe("lib/auth/require-session", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("RequireSessionUser", () => {
    it("should return null when no session", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)
      vi.mocked(headers).mockResolvedValue(new Headers())

      const result = await RequireSessionUser()

      expect(result).toBeNull()
      expect(auth.api.getSession).toHaveBeenCalledWith({
        headers: expect.any(Headers),
      })
    })

    type SessionResponse = Awaited<
      ReturnType<typeof auth.api.getSession>
    >

    it("should return null when session has no user", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: MINIMAL_SESSION,
        user: null,
      } as unknown as SessionResponse)
      vi.mocked(headers).mockResolvedValue(new Headers())

      const result = await RequireSessionUser()

      expect(result).toBeNull()
    })

    it("should return SessionUser when session has user", async () => {
      const userId = "user-123"
      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: MINIMAL_SESSION,
        user: { id: userId },
      } as unknown as SessionResponse)
      vi.mocked(headers).mockResolvedValue(new Headers())

      const result = await RequireSessionUser()

      expect(result).toEqual({
        id: userId,
      } satisfies SessionUser)
    })

    it("should return SessionUser with correct id from session", async () => {
      const userId = "another-user-456"
      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: MINIMAL_SESSION,
        user: { id: userId },
      } as unknown as SessionResponse)
      vi.mocked(headers).mockResolvedValue(new Headers())

      const result = await RequireSessionUser()

      expect(result).toEqual({
        id: userId,
      } satisfies SessionUser)
    })
  })
})
