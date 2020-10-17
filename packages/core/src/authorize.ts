import { Ctx, AuthorizationError } from "blitz"
import { AbilityType, ResourceType, IGuard } from "@blitz-guard/core"

type ResolverType<U> = (args: U, ctx: Ctx) => any

export const authorizeInit = (GuardInstance: IGuard) => <U>(
  ability: AbilityType,
  resource: ResourceType,
  resolver: ResolverType<U>,
) => async (args: U, ctx: Ctx & { guardSecured: boolean }) => {
  ctx.guardSecured = true
  const isAuthorized = await GuardInstance.test(ctx, args, ability, resource as ResourceType)
  if (!isAuthorized) throw new AuthorizationError("GUARD: UNAUTHORIZED")

  return resolver(args, ctx as Ctx & { guardSecured: boolean })
}
