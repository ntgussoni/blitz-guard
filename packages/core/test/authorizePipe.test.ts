/* eslint-disable require-await */
import { GuardBuilder, IGuardBuilder } from "@blitz-guard/core"
import { AuthorizationError, Ctx, resolver } from "blitz"

let Guard: IGuardBuilder<"comment" | "camelCaseResource" | "article" | "reason1" | "reason2">
const reason = "I must have a good reason!"

describe("authorizePipe", () => {
  beforeAll(() => {
    Guard = GuardBuilder(async (_, { can, cannot }) => {
      cannot("manage", "all")
      can("create", "comment")
      can("create", "camelCaseResource")
      cannot("create", "article")
      cannot("create", "reason1")
      cannot("create", "reason2").reason(reason)
    })
  })

  describe("can create camelCaseResource", () => {
    it("executes passes down the data", async () => {
      expect.assertions(1)
      const resolver1 = resolver.pipe(
        Guard.authorizePipe("create", "camelCaseResource"),
        (input: any) => {
          return input.somedata
        },
      )
      const res = await resolver1(
        { somedata: "blah" },
        { session: { $authorize: () => undefined } as Ctx },
      )
      expect(res).toBe("blah")
    })
  })

  describe("can create comment", () => {
    it("executes passes down the data", async () => {
      expect.assertions(1)
      const resolver1 = resolver.pipe(Guard.authorizePipe("create", "comment"), (input: any) => {
        return input.somedata
      })
      const res = await resolver1(
        { somedata: "blah" },
        { session: { $authorize: () => undefined } as Ctx },
      )
      expect(res).toBe("blah")
    })
  })

  describe("cannot create article", () => {
    it("doesn't execute callback", async () => {
      expect.assertions(3)
      const testFn = jest.fn(() => Promise.resolve("good!"))

      const resolver1 = resolver.pipe(Guard.authorizePipe("create", "article"), testFn)
      try {
        await resolver1({ somedata: "blah" }, { session: { $authorize: () => undefined } as Ctx })
      } catch (e) {
        expect(e).toBeInstanceOf(AuthorizationError)
        expect(e.message).toBe("GUARD: UNAUTHORIZED")
      }
      expect(testFn).toBeCalledTimes(0)
    })
  })

  describe("reason", () => {
    it("shows default rason", async () => {
      expect.assertions(3)
      const testFn = jest.fn(() => Promise.resolve("good!"))

      const resolver1 = resolver.pipe(Guard.authorizePipe("create", "reason1"), testFn)
      try {
        await resolver1({ somedata: "blah" }, { session: { $authorize: () => undefined } as Ctx })
      } catch (e) {
        expect(e).toBeInstanceOf(AuthorizationError)
        expect(e.message).toBe("GUARD: UNAUTHORIZED")
      }
      expect(testFn).toBeCalledTimes(0)
    })

    it("provides a good reason", async () => {
      expect.assertions(3)
      const testFn = jest.fn(() => Promise.resolve("good!"))

      const resolver1 = resolver.pipe(Guard.authorizePipe("create", "reason2"), testFn)
      try {
        await resolver1({ somedata: "blah" }, { session: { $authorize: () => undefined } as Ctx })
      } catch (e) {
        expect(e).toBeInstanceOf(AuthorizationError)
        expect(e.message).toBe(reason)
      }
      expect(testFn).toBeCalledTimes(0)
    })
  })
})
