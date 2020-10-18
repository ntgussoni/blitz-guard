import { IGuard, GuardInit } from "@blitz-guard/core"

describe("GuardInit", () => {
  let Guard: IGuard

  describe("After initializing Guard with no ability file", () => {
    beforeAll(() => {
      // @ts-expect-error
      Guard = GuardInit()
    })

    it("show an error", () => {
      expect(Guard).toThrow("Ability file not present")
    })
  })
})
