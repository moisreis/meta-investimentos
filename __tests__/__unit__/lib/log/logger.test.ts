import { describe, it, expect, vi } from "vitest"
import { LogWarn, LogError } from "@/lib/log/logger"

describe("lib/log/logger", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {})
    consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe("LogWarn", () => {
    it("should write warning with scope and message", () => {
      LogWarn("TestScope", "test message")

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[TestScope] test message"
      )
    })

    it("should write warning with scope, message and detail", () => {
      const detail = { code: "ERR_TEST" }
      LogWarn("TestScope", "test message", detail)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[TestScope] test message",
        detail
      )
    })

    it("should not include undefined detail in output", () => {
      LogWarn("TestScope", "test message", undefined)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[TestScope] test message"
      )
    })
  })

  describe("LogError", () => {
    it("should write error with scope and message", () => {
      LogError("TestScope", "test error")

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[TestScope] test error"
      )
    })

    it("should write error with scope, message and detail", () => {
      const detail = new Error("boom")
      LogError("TestScope", "test error", detail)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[TestScope] test error",
        detail
      )
    })

    it("should not include undefined detail in output", () => {
      LogError("TestScope", "test error", undefined)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[TestScope] test error"
      )
    })
  })
})
