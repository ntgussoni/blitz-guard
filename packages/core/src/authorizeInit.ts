import { IGuard } from "./types"
import { authorize, authorizePipe } from "./authorize"

export function authorizeInit<IResource, IAbility>(GuardInstance: IGuard<IResource, IAbility>) {
  return {
    authorize: authorize<IResource, IAbility>(GuardInstance),
    authorizePipe: authorizePipe<IResource, IAbility>(GuardInstance),
  }
}
