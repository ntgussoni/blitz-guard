import { GuardBuilder } from "@blitz-guard/core"

describe("GuardBuilder", () => {
  describe("with no ability file", () => {
    it("throws an error", () => {
      expect(() => {
        // @ts-expect-error
        GuardBuilder()
      }).toThrow("GUARD: Ability file not present")
    })
  })
})
