/* eslint-disable require-await */
import { GuardBuilder, IGuardBuilder } from "@blitz-guard/core"

let Guard: IGuardBuilder<any, any>

describe("Guard", () => {
  describe("can", () => {
    describe("adding a rule with no guard", () => {
      beforeAll(() => {
        Guard = GuardBuilder<any>(async () => {})
        Guard.instance._can("create", "comment")
      })

      it("contains one rule", () => {
        expect(Guard.instance.getRules().length).toEqual(1)
      })

      it("contains the right values", () => {
        expect(Guard.instance.getRules()[0].ability).toEqual("create")
        expect(Guard.instance.getRules()[0].resource).toEqual("comment")
        expect(Guard.instance.getRules()[0].behavior).toEqual(true)
      })
      it("has no guard", () => {
        expect(Guard.instance.getRules()[0].guard).toEqual(undefined)
      })
    })
    describe("adding a rule with a guard", () => {
      const canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async () => {})
        Guard.instance._can("create", "comment", canGuard)
      })

      it("contains the guard", () => {
        expect(Guard.instance.getRules()[0].guard).toStrictEqual(canGuard)
      })
    })

    describe("adding two rules with the same values", () => {
      const canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async () => {})
        Guard.instance._can("create", "comment", canGuard)
        Guard.instance._can("create", "comment", canGuard)
      })

      it("it adds both", () => {
        expect(Guard.instance.getRules().length).toEqual(2)
      })
    })

    describe("adding a rule with made-up ability and resource", () => {
      const canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async () => {})
        Guard.instance._can("foo", "bar", canGuard)
      })

      it("it adds the rule", () => {
        expect(Guard.instance.getRules()[0].ability).toEqual("foo")
        expect(Guard.instance.getRules()[0].resource).toEqual("bar")
      })
    })
  })

  describe("cannot", () => {
    describe("adding one rule with no guard", () => {
      beforeAll(() => {
        Guard = GuardBuilder(async () => {})
        Guard.instance._cannot("create", "comment")
      })

      it("contains one rule", () => {
        expect(Guard.instance.getRules().length).toEqual(1)
      })

      it("contains the right values", () => {
        expect(Guard.instance.getRules()[0].ability).toEqual("create")
        expect(Guard.instance.getRules()[0].resource).toEqual("comment")
        expect(Guard.instance.getRules()[0].behavior).toEqual(false)
        expect(Guard.instance.getRules()[0].guard).toEqual(undefined)
      })
    })
    describe("adding one rule with a guard", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async () => {})
        Guard.instance._cannot("create", "comment", canGuard)
      })

      it("contains the right guard", () => {
        expect(Guard.instance.getRules()[0].guard).toStrictEqual(canGuard)
      })
    })

    describe("adding two rules with the same values", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async () => {})
        Guard.instance._cannot("create", "comment", canGuard)
        Guard.instance._cannot("create", "comment", canGuard)
      })

      it("it adds both", () => {
        expect(Guard.instance.getRules().length).toEqual(2)
      })
    })

    describe("adding a rule with made-up ability and resource", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardBuilder(async () => {})
        Guard.instance._cannot("foo", "bar", canGuard)
      })

      it("it adds the rule", () => {
        expect(Guard.instance.getRules()[0].ability).toEqual("foo")
        expect(Guard.instance.getRules()[0].resource).toEqual("bar")
      })
    })
  })
})
