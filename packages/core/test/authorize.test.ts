/* eslint-disable require-await */
import { authorizeInit, GuardInit } from "@blitz-guard/core"
import { AuthorizationError } from "blitz"
import { IGuard } from "guard"

let Guard: IGuard<any>
let Authorize: any
describe("Authorize", () => {
  beforeEach(() => {
    Guard = GuardInit<any>(async (_, { can, cannot }) => {
      can("create", "comment")
      cannot("create", "article")
    })
    Authorize = authorizeInit(Guard)
  })

  describe("can create comment", () => {
    it("executes callback", async () => {
      expect.assertions(1)
      const callback = jest.fn(() => Promise.resolve("good!"))
      await Authorize("create", "comment", callback)({}, {})
      expect(callback).toBeCalledTimes(1)
    })

    it("passes down ctx and data", async () => {
      const testArgs = { foo: "bar" }
      const testCtx = { session: { userId: 1 } }
      expect.assertions(3)
      const callback = jest.fn((args, ctx) => {
        expect(args).toStrictEqual(testArgs)
        expect(ctx).toStrictEqual(testCtx)
      })
      await Authorize("create", "comment", callback)(testArgs, testCtx)
      expect(callback).toBeCalledTimes(1)
    })
  })

  describe("cannot create article", () => {
    it("doesn't execute callback", async () => {
      expect.assertions(3)
      const callback = jest.fn(() => Promise.resolve("good!"))
      try {
        await Authorize("create", "article", callback)({}, {})
      } catch (e) {
        expect(e).toBeInstanceOf(AuthorizationError)
        expect(e.message).toBe("GUARD: UNAUTHORIZED")
      }
      expect(callback).toBeCalledTimes(0)
    })
  })
})
