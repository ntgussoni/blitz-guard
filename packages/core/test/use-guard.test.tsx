/* eslint-disable require-await */
import { renderHook } from "@testing-library/react-hooks"
import { GuardInit, useGuardInit, getAbilityInit } from "@blitz-guard/core"
import { deserialize } from "superjson"

declare global {
  namespace NodeJS {
    interface Global {
      fetch: any
    }
  }
}

function enhanceQueryFn(fn: any, ctx?: any) {
  const newFn = (...args: any) => {
    const [data] = args
    return new Promise((resolve) =>
      setTimeout(() => resolve(fn(deserialize(data), ctx)), 100),
    ) as any
  }
  newFn._meta = {
    name: "testResolver",
    type: "query",
    path: "app/test",
    apiUrl: "test/url",
  }
  return newFn
}

let useGuard: any

describe("useGuard", () => {
  beforeEach(() => {
    const Guard = GuardInit<any>(async (ctx: any, { can, cannot }) => {
      can("create", "comment")
      cannot("create", "article")
      cannot("create", "user", async ({ id }) => id === "foo" && ctx.user === "bar")
      cannot("create", "category", async () => ctx.user === "bar")
    })
    const getAbility = getAbilityInit(Guard)
    useGuard = useGuardInit(enhanceQueryFn(getAbility, { user: "bar" }))
  })

  describe("without guard", () => {
    it("returns the right values", async () => {
      const { result, unmount, waitFor } = renderHook(() =>
        useGuard([
          ["create", "comment"],
          ["create", "article"],
        ]),
      )
      // TODO: check is loading
      try {
        await waitFor(() => result.current[1].isLoading === false)
        expect(result.current).toStrictEqual([[true, false], { isLoading: false }])
      } finally {
        unmount()
      }
    })
  })

  describe("with guard", () => {
    it("returns the right values even if not requierd", async () => {
      const { result, unmount, waitFor } = renderHook(() =>
        useGuard([
          ["create", "comment"],
          ["create", "article", { id: "something" }],
        ]),
      )
      // TODO: check is loading
      try {
        await waitFor(() => result.current[1].isLoading === false)
        expect(result.current).toStrictEqual([[true, false], { isLoading: false }])
      } finally {
        unmount()
      }
    })

    it("returns the right values", async () => {
      const { result, unmount, waitFor } = renderHook(() =>
        useGuard([
          ["create", "user", { id: "foo" }],
          ["create", "user", { id: "bar" }],
          ["create", "category"],
          ["create", "inexistent"],
        ]),
      )
      // TODO: check is loading
      try {
        await waitFor(() => result.current[1].isLoading === false)
        expect(result.current).toStrictEqual([[false, true, false, true], { isLoading: false }])
      } finally {
        unmount()
      }
    })
  })
})
