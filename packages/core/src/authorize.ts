import { Ctx, AuthorizationError } from "blitz"
import { IGuard, IAuthorize } from "./types"

export function authorizeInit<T, R>(GuardInstance: IGuard<T, R>): IAuthorize<T, R> {
  return (ability, resource, resolver) => async (args, ctx) => {
    ;(ctx as any).__securedByGuard = true
    const isAuthorized = await GuardInstance.can(ctx, args, ability, resource)
    if (!isAuthorized) throw new AuthorizationError("GUARD: UNAUTHORIZED")

    return resolver(args, ctx as Ctx)
  }
}
