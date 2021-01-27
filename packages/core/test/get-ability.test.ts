/* eslint-disable require-await */
import { GuardBuilder, IGuardBuilder } from "@blitz-guard/core"

let Guard: IGuardBuilder<any, any>

describe("getAbility", () => {
  beforeEach(() => {
    Guard = GuardBuilder<any>(async (ctx: any, { can, cannot }) => {
      can("create", "comment")
      cannot("create", "article")
      cannot("create", "user", async ({ id }) => id === "foo" && ctx.user === "bar")
      cannot("create", "category", async () => ctx.user === "bar")
    })
  })

  describe("without guard", () => {
    it("returns the right values", async () => {
      expect(
        await Guard.getAbility(
          [
            ["create", "comment"],
            ["create", "article"],
          ],
          { user: "bar" },
        ),
      ).toStrictEqual([true, false])
    })
  })

  describe("with guard", () => {
    it("returns the right values even if not requierd", async () => {
      expect(
        await Guard.getAbility(
          [
            ["create", "comment"],
            ["create", "article", { id: "something" }],
          ],
          {
            user: "bar",
          },
        ),
      ).toStrictEqual([true, false])
    })

    it("returns the right values", async () => {
      expect(
        await Guard.getAbility(
          [
            ["create", "user", { id: "foo" }],
            ["create", "user", { id: "bar" }],
            ["create", "category"],
            ["create", "inexistent"],
          ],
          {
            user: "bar",
          },
        ),
      ).toStrictEqual([false, true, false, true])
    })
  })
})
