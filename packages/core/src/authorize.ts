import { AuthorizationError, Ctx } from "blitz"
// import { GuardAuthorizationError } from "./GuardAuthorizationError"
import { IGuard, IAuthorize, IAuthorizePipe } from "./types"

export const authorize = <IResource, IAbility>(
  GuardInstance: IGuard<IResource, IAbility>,
): IAuthorize<IResource, IAbility> => {
  return (ability, resource, resolver) => async (args, ctx) => {
    ;(ctx as any).__securedByGuard = true
    const { can: isAuthorized, reason } = await GuardInstance.can(ability, resource, ctx, args)

    if (!isAuthorized) throw new AuthorizationError(reason || "GUARD: UNAUTHORIZED")
    // We need a new version of superjson that serializes errors properly
    // throw new GuardAuthorizationError<IResource, IAbility>({ ability, resource, reason })

    return resolver(args, ctx as Ctx)
  }
}

export const authorizePipe = <IResource, IAbility>(
  GuardInstance: IGuard<IResource, IAbility>,
): IAuthorizePipe<IResource, IAbility> => {
  return (ability, resource) => async (input, ctx) => {
    ;(ctx as any).__securedByGuard = true
    const { can: isAuthorized, reason } = await GuardInstance.can(ability, resource, ctx, input)

    if (!isAuthorized) throw new AuthorizationError(reason || "GUARD: UNAUTHORIZED")

    // throw new GuardAuthorizationError<IResource, IAbility>({ ability, resource, reason })

    return input
  }
}
