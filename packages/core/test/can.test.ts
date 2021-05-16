/* eslint-disable require-await */
import { GuardBuilder, IGuardBuilder } from "@blitz-guard/core"

describe("Guard.can", () => {
  it("returns true if no rules", async () => {
    const Guard = GuardBuilder<"comment">(async () => {})
    expect.assertions(2)
    expect(Guard.instance.getPreviouslyRanRules().length).toBe(0)
    const result = await Guard.can("create", "comment", {}, null)
    expect(result).toEqual({ can: true, reason: "" })
  })
})

describe("Guard.can", () => {
  let Guard: IGuardBuilder

  it("throws error on empty ctx", () => {
    Guard = GuardBuilder(async (_, { cannot }) => {
      cannot("manage", "all")
    })
    Guard.can("create", "comment", {}, undefined).catch((e) => {
      expect(e.message).toBe("GUARD: ctx cannot be empty")
    })
  })
  it("throws error on empty ability", () => {
    Guard = GuardBuilder(async (_, { cannot }) => {
      cannot("manage", "all")
    })
    Guard.can(undefined, "comment", {}, undefined).catch((e) => {
      expect(e.message).toBe("GUARD: ability cannot be empty")
    })
  })
  it("throws error on empty resource", () => {
    Guard = GuardBuilder(async (_, { cannot }) => {
      cannot("manage", "all")
    })
    Guard.can("foo", undefined, {}, undefined).catch((e) => {
      expect(e.message).toBe("GUARD: resource cannot be empty")
    })
  })

  it("last rule of the same ability-resource is applied", async () => {
    expect.assertions(2)

    Guard = GuardBuilder(async (_, { can, cannot }) => {
      cannot("manage", "all")
      cannot("create", "comment")
      can("create", "comment")
    })

    const result = await Guard.can("create", "comment", {}, null)
    expect(result).toEqual({ can: true, reason: "" })

    Guard = GuardBuilder(async (_, { can, cannot }) => {
      cannot("manage", "all")
      cannot("create", "comment")
      can("create", "comment")
      cannot("create", "comment")
    })

    const result2 = await Guard.can("create", "comment", {}, null)
    expect(result2).toEqual({ can: false, reason: "" })
  })

  describe("resource == 'all'", () => {
    it("applies to any resource", async () => {
      Guard = GuardBuilder(async (_, { cannot }) => {
        cannot("create", "all")
      })
      const result = await Guard.can("create", "foo", {}, null)
      expect(result).toEqual({ can: false, reason: "" })
    })
  })

  describe("ability == 'manage'", () => {
    it("applies to any ability", async () => {
      Guard = GuardBuilder(async (_, { cannot }) => {
        cannot("manage", "comment")
      })
      const result = await Guard.can("bar", "comment", {}, null)
      expect(result).toEqual({ can: false, reason: "" })
    })
  })

  describe("rule with a guard", () => {
    let testArgs = { foo: "bar" }

    it("args are passed to the guard ", () => {
      expect.assertions(2)

      Guard = GuardBuilder(async (_, { cannot }) => {
        cannot("manage", "comment", async (args) => {
          expect(args).toStrictEqual(testArgs)
          expect(args.foo).toStrictEqual("bar")
          return true
        })
      })
      return Guard.can("bar", "comment", {}, testArgs)
    })

    describe("guard returning true", () => {
      it("rule is applied", async () => {
        Guard = GuardBuilder(async (_, { cannot }) => {
          cannot("manage", "comment", async () => Promise.resolve(true))
        })
        const result = await Guard.can("bar", "comment", {}, null)
        expect(result).toEqual({ can: false, reason: "" })
      })
    })

    describe("guard returning false", () => {
      it("rule is not applied", async () => {
        Guard = GuardBuilder(async (_, { cannot }) => {
          cannot("manage", "comment", async () => Promise.resolve(false))
        })
        const result = await Guard.can("bar", "comment", {}, null)
        expect(result).toEqual({ can: true, reason: "" })
      })
    })
  })

  describe("performance", () => {
    let testGuard1: any
    let testGuard2: any

    beforeEach(() => {
      testGuard1 = jest.fn(async () => Promise.resolve(true))
      testGuard2 = jest.fn(async () => Promise.resolve(true))
    })
    it("rules of a different ability-resource dont get executed", async () => {
      expect.assertions(2)
      Guard = GuardBuilder(async (_, { cannot }) => {
        cannot("create", "article", testGuard1)
        cannot("create", "comment", testGuard2)
      })

      await Guard.can("create", "comment", {}, null)

      expect(testGuard1).toBeCalledTimes(0)
      expect(testGuard2).toBeCalledTimes(1)
    })

    it("only last rule of same ability-resource gets called", async () => {
      expect.assertions(2)

      Guard = GuardBuilder(async (_, { can, cannot }) => {
        cannot("create", "comment", testGuard1)
        can("create", "comment", testGuard2)
      })
      await Guard.can("create", "comment", {}, null)

      expect(testGuard1).toBeCalledTimes(0)
      expect(testGuard2).toBeCalledTimes(1)
    })

    it("first guard false then next rule is called", async () => {
      testGuard2 = jest.fn(async () => Promise.resolve(false))
      expect.assertions(2)

      Guard = GuardBuilder(async (_, { can, cannot }) => {
        cannot("create", "comment", testGuard1)
        can("create", "comment", testGuard2)
      })

      await Guard.can("create", "comment", {}, null)

      expect(testGuard1).toBeCalledTimes(1)
      expect(testGuard2).toBeCalledTimes(1)
    })
  })

  describe("reason", () => {
    it("shows the last reason", async () => {
      const wrongReason = "Because I want to"
      const wrongReason2 = "Because I want to 2"

      const rightReason = "im an admin"

      Guard = GuardBuilder(async (_, { can, cannot }) => {
        can("manage", "comment").reason(rightReason)
        cannot("manage", "comment").reason(wrongReason)
        cannot("manage", "comment").reason(wrongReason2)
      })
      const { reason } = await Guard.can("bar", "comment", {}, null)
      expect(reason).toBe(wrongReason2)
    })
  })
})
