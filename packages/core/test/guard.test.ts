/* eslint-disable require-await */
import { GuardBuilder, IGuardBuilder } from "@blitz-guard/core"

let Guard: IGuardBuilder<any, any>

describe("Guard", () => {
  describe("can", () => {
    describe("adding a rule with no guard", () => {
      beforeAll(() => {
        Guard = GuardBuilder<any>(async (_, { can }) => {
          can("create", "comment")
        })
        Guard.can("manage", "all", {}, {}) // This is just to process all the rules as they are processed while checking for them
      })

      it("contains one rule", () => {
        expect(Guard.instance.getPreviouslyRanRules().length).toEqual(1)
      })

      it("contains the right values", () => {
        expect(Guard.instance.getPreviouslyRanRules()[0].ability).toEqual("create")
        expect(Guard.instance.getPreviouslyRanRules()[0].resource).toEqual("comment")
        expect(Guard.instance.getPreviouslyRanRules()[0].behavior).toEqual(true)
      })
      it("has no guard", () => {
        expect(Guard.instance.getPreviouslyRanRules()[0].guard).toEqual(undefined)
      })
    })
    describe("adding a rule with a guard", () => {
      const canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async (_, { can }) => {
          can("create", "comment", canGuard)
        })
        Guard.can("manage", "all", {}, {}) // This is just to process all the rules as they are processed while checking for them
      })

      it("contains the guard", () => {
        expect(Guard.instance.getPreviouslyRanRules()[0].guard).toStrictEqual(canGuard)
      })
    })

    describe("adding two rules with the same values", () => {
      const canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async (_, { can }) => {
          can("create", "comment", canGuard)
          can("create", "comment", canGuard)
        })
        Guard.can("manage", "all", {}, {}) // This is just to process all the rules as they are processed while checking for them
      })

      it("it adds both", () => {
        expect(Guard.instance.getPreviouslyRanRules().length).toEqual(2)
      })
    })

    describe("adding a rule with made-up ability and resource", () => {
      const canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async (_, { can }) => {
          can("foo", "bar", canGuard)
        })
        Guard.can("manage", "all", {}, {}) // This is just to process all the rules as they are processed while checking for them
      })

      it("it adds the rule", () => {
        expect(Guard.instance.getPreviouslyRanRules()[0].ability).toEqual("foo")
        expect(Guard.instance.getPreviouslyRanRules()[0].resource).toEqual("bar")
      })
    })
  })

  describe("cannot", () => {
    describe("adding one rule with no guard", () => {
      beforeAll(() => {
        Guard = GuardBuilder(async (_, { cannot }) => {
          cannot("create", "comment")
        })
        Guard.can("manage", "all", {}, {}) // This is just to process all the rules as they are processed while checking for them
      })

      it("contains one rule", () => {
        expect(Guard.instance.getPreviouslyRanRules().length).toEqual(1)
      })

      it("contains the right values", () => {
        expect(Guard.instance.getPreviouslyRanRules()[0].ability).toEqual("create")
        expect(Guard.instance.getPreviouslyRanRules()[0].resource).toEqual("comment")
        expect(Guard.instance.getPreviouslyRanRules()[0].behavior).toEqual(false)
        expect(Guard.instance.getPreviouslyRanRules()[0].guard).toEqual(undefined)
      })
    })
    describe("adding one rule with a guard", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async (_, { cannot }) => {
          cannot("create", "comment", canGuard)
        })
        Guard.can("manage", "all", {}, {}) // This is just to process all the rules as they are processed while checking for them
      })

      it("contains the right guard", () => {
        expect(Guard.instance.getPreviouslyRanRules()[0].guard).toStrictEqual(canGuard)
      })
    })

    describe("adding two rules with the same values", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async (_, { cannot }) => {
          cannot("create", "comment", canGuard)
          cannot("create", "comment", canGuard)
        })
        Guard.can("manage", "all", {}, {}) // This is just to process all the rules as they are processed while checking for them
      })

      it("it adds both", () => {
        expect(Guard.instance.getPreviouslyRanRules().length).toEqual(2)
      })
    })

    describe("adding a rule with made-up ability and resource", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async (_, { cannot }) => {
          cannot("foo", "bar", canGuard)
        })
        Guard.can("manage", "all", {}, {}) // This is just to process all the rules as they are processed while checking for them
      })

      it("it adds the rule", () => {
        expect(Guard.instance.getPreviouslyRanRules()[0].ability).toEqual("foo")
        expect(Guard.instance.getPreviouslyRanRules()[0].resource).toEqual("bar")
      })
    })
  })
})
