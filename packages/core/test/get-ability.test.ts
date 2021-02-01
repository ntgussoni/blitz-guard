/* eslint-disable require-await */
import { GuardBuilder, IGuardBuilder } from "@blitz-guard/core"

let Guard: IGuardBuilder<"comment" | "article" | "user" | "category", undefined>

describe("getAbility", () => {
  beforeEach(() => {
    Guard = GuardBuilder(async (ctx: any, { can, cannot }) => {
      cannot("manage", "all")
      can("create", "comment")
      can("create", "article")
      can("create", "user", async ({ id }) => id === "foo" && ctx.user === "bar")
      can("create", "category", async () => ctx.user === "bar")
    })
  })

  describe("without guard", () => {
    it("returns the right values", async () => {
      const res = await Guard.getAbility(
        [
          ["create", "comment"],
          ["create", "article"],
        ],
        { user: "bar" },
      )

      expect(res).toStrictEqual([true, true])
    })
  })

  describe("with guard", () => {
    it("returns the right values even if not required", async () => {
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
      ).toStrictEqual([true, true])
    })

    it("returns the right values", async () => {
      expect(
        await Guard.getAbility(
          [
            ["create", "user", { id: "foo" }],
            ["create", "user", { id: "bar" }],
            ["create", "category"],
          ],
          {
            user: "bar",
          },
        ),
      ).toStrictEqual([true, false, true])
    })
  })
})
