import { GuardInit } from "@blitz-guard/core"

describe("GuardInit", () => {
  describe("with no ability file", () => {
    it("throws an error", () => {
      expect(() => {
        // @ts-expect-error
        GuardInit()
      }).toThrow("GUARD: Ability file not present")
    })
  })
})
