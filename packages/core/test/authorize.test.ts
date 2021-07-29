/* eslint-disable require-await */
import { GuardBuilder, IGuardBuilder } from "../index"
import { AuthorizationError, Ctx } from "blitz"

let Guard: IGuardBuilder<"comment" | "camelCaseResource" | "article">
const reason = "I must have a good reason!"
describe("Authorize", () => {
  beforeAll(() => {
    Guard = GuardBuilder(async (_, { can, cannot }) => {
      cannot("manage", "all")
      can("create", "comment")
      can("create", "camelCaseResource")
      cannot("create", "article").reason(reason)
    })
  })

  describe("can create camelCaseResource", () => {
    it("executes callback", async () => {
      expect.assertions(2)
      const callback = jest.fn(() => Promise.resolve("good!"))
      const res = await Guard.authorize("create", "camelCaseResource", callback)({}, {})
      expect(callback).toBeCalledTimes(1)
      expect(res).toBe("good!")
    })
  })

  describe("can create comment", () => {
    it("executes callback", async () => {
      expect.assertions(2)
      const callback = jest.fn(() => Promise.resolve("good!"))
      const res = await Guard.authorize("create", "comment", callback)({}, {})
      expect(callback).toBeCalledTimes(1)
      expect(res).toBe("good!")
    })

    it("passes down ctx and data", async () => {
      const testArgs = { foo: "bar" }
      const testCtx = { session: { userId: 1 } }
      expect.assertions(3)
      const callback = jest.fn((args, ctx: Ctx) => {
        expect(args).toStrictEqual(testArgs)
        expect(ctx).toStrictEqual(testCtx)
      })
      await Guard.authorize("create", "comment", callback as any)(testArgs, testCtx)
      expect(callback).toBeCalledTimes(1)
    })
  })

  describe("cannot create article", () => {
    it("doesn't execute callback", async () => {
      expect.assertions(3)
      const callback = jest.fn(() => Promise.resolve("good!"))
      try {
        await Guard.authorize("create", "article", callback)({}, {})
      } catch (e) {
        // expect(e).toBeInstanceOf(GuardAuthorizationError)
        expect(e).toBeInstanceOf(AuthorizationError)
        expect(e.message).toBe(reason)
        // expect(e.rule.ability).toBe("create")
        // expect(e.rule.resource).toBe("article")
      }
      expect(callback).toBeCalledTimes(0)
    })
  })
})
