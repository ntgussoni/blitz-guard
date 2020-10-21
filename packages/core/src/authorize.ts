import { Ctx, AuthorizationError } from "blitz"
import { AbilityType, ResourceType, IGuard } from "@blitz-guard/core"

type ResolverType<U> = (args: U, ctx: Ctx) => any

export const authorizeInit = <T>(GuardInstance: IGuard<T>) => <U>(
  ability: AbilityType,
  resource: ResourceType<T>,
  resolver: ResolverType<U>,
) => async (args: U, ctx: Ctx & { securedByGuard: boolean }) => {
  ctx.securedByGuard = true
  const isAuthorized = await GuardInstance.test(ctx, args, ability, resource)
  if (!isAuthorized) throw new AuthorizationError("GUARD: UNAUTHORIZED")

  return resolver(args, ctx as Ctx & { securedByGuard: boolean })
}
