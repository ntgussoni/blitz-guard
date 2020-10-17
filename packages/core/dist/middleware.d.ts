import { Ctx } from "blitz"
type configType = {
  excluded: string[]
}
declare const BlitzGuardMiddleware: ({
  excluded,
}: configType) => (
  req: any,
  res: {
    blitzCtx: Ctx & {
      securedByGuard: boolean
    }
  },
  next: () => any,
) => Promise<any>
export { BlitzGuardMiddleware }
