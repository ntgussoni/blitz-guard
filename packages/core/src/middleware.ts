import { Ctx } from "blitz"
import chalk from "chalk"

type configType = {
  excluded: string[]
}
export const BlitzGuardMiddleware = ({ excluded = [] }: configType) => async (
  req: any,
  res: { blitzCtx: Ctx & { securedByGuard: boolean } },
  next: () => any,
) => {
  res.blitzCtx.securedByGuard = false

  const nextResult = await next()

  if (process.env.NODE_ENV !== "production") {
    if (!excluded.includes(req.url) && res.blitzCtx.securedByGuard === false) {
      console.warn(chalk.yellow(`[🛡️  Blitz Guard]: ${req.url} is not secured`))
    }
  }

  return nextResult
}
