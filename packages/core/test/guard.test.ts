/* eslint-disable require-await */
import { GuardInit } from "@blitz-guard/core"
import { IGuard } from "guard"

let Guard: IGuard<any>

describe("Guard", () => {
  describe("can", () => {
    describe("adding a rule with no guard", () => {
      beforeAll(() => {
        Guard = GuardInit<any>(async () => {})
        Guard.can("create", "comment")
      })

      it("contains one rule", () => {
        expect(Guard.rules.length).toEqual(1)
      })

      it("contains the right values", () => {
        expect(Guard.rules[0].ability).toEqual("create")
        expect(Guard.rules[0].resource).toEqual("comment")
        expect(Guard.rules[0].behavior).toEqual(true)
      })
      it("has no guard", () => {
        expect(Guard.rules[0].guard).toEqual(undefined)
      })
    })
    describe("adding a rule with a guard", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardInit<any>(async () => {})
        Guard.can("create", "comment", canGuard)
      })

      it("contains the guard", () => {
        expect(Guard.rules[0].guard).toStrictEqual(canGuard)
      })
    })

    describe("adding two rules with the same values", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardInit<any>(async () => {})
        Guard.can("create", "comment", canGuard)
        Guard.can("create", "comment", canGuard)
      })

      it("it adds both", () => {
        expect(Guard.rules.length).toEqual(2)
      })
    })

    describe("adding a rule with made-up ability and resource", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardInit<any>(async () => {})
        Guard.can("foo", "bar", canGuard)
      })

      it("it adds the rule", () => {
        expect(Guard.rules[0].ability).toEqual("foo")
        expect(Guard.rules[0].resource).toEqual("bar")
      })
    })
  })

  describe("cannot", () => {
    describe("adding one rule with no guard", () => {
      beforeAll(() => {
        Guard = GuardInit<any>(async () => {})
        Guard.cannot("create", "comment")
      })

      it("contains one rule", () => {
        expect(Guard.rules.length).toEqual(1)
      })

      it("contains the right values", () => {
        expect(Guard.rules[0].ability).toEqual("create")
        expect(Guard.rules[0].resource).toEqual("comment")
        expect(Guard.rules[0].behavior).toEqual(false)
        expect(Guard.rules[0].guard).toEqual(undefined)
      })
    })
    describe("adding one rule with a guard", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardInit<any>(async () => {})
        Guard.cannot("create", "comment", canGuard)
      })

      it("contains the right guard", () => {
        expect(Guard.rules[0].guard).toStrictEqual(canGuard)
      })
    })

    describe("adding two rules with the same values", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardInit<any>(async () => {})
        Guard.cannot("create", "comment", canGuard)
        Guard.cannot("create", "comment", canGuard)
      })

      it("it adds both", () => {
        expect(Guard.rules.length).toEqual(2)
      })
    })

    describe("adding a rule with made-up ability and resource", () => {
      let canGuard = async () => true
      beforeAll(() => {
        Guard = GuardInit<any>(async () => {})
        Guard.cannot("foo", "bar", canGuard)
      })

      it("it adds the rule", () => {
        expect(Guard.rules[0].ability).toEqual("foo")
        expect(Guard.rules[0].resource).toEqual("bar")
      })
    })
  })
})
