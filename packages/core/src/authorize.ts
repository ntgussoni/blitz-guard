import { Ctx, AuthorizationError } from "blitz"
import { IGuard, IAuthorize, IAuthorizePipe } from "./types"

const authorize = <T, R>(GuardInstance: IGuard<T, R>): IAuthorize<T, R> => {
  return (ability, resource, resolver) => async (args, ctx) => {
    ;(ctx as any).__securedByGuard = true
    const isAuthorized = await GuardInstance.can(ability, resource, ctx, args)
    if (!isAuthorized) throw new AuthorizationError("GUARD: UNAUTHORIZED")

    return resolver(args, ctx as Ctx)
  }
}

const authorizePipe = <T, R>(GuardInstance: IGuard<T, R>): IAuthorizePipe<T, R> => {
  return (ability, resource) => async (input, ctx) => {
    ;(ctx as any).__securedByGuard = true
    const isAuthorized = await GuardInstance.can(ability, resource, ctx, input)
    if (!isAuthorized) throw new AuthorizationError("GUARD: UNAUTHORIZED")

    return input
  }
}

export function authorizeInit<T, R>(GuardInstance: IGuard<T, R>) {
  return {
    authorize: authorize<T, R>(GuardInstance),
    authorizePipe: authorizePipe<T, R>(GuardInstance),
  }
}
