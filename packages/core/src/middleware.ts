import { Ctx } from "blitz"

type configType = {
  excluded: string[]
}
export const BlitzGuardMiddleware = ({ excluded = [] }: configType) => async (
  req: any,
  res: { blitzCtx: Ctx & { __securedByGuard: boolean } },
  next: () => any,
) => {
  res.blitzCtx.__securedByGuard = false

  const nextResult = await next()

  if (process.env.NODE_ENV !== "production") {
    if (!excluded.includes(req.url) && res.blitzCtx.__securedByGuard === false) {
      console.warn("\x1b[33m%s\x1b[0m", `[Blitz Guard]: ${req.url} is not secured`)
    }
  }

  return nextResult
}
