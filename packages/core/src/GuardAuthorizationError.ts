import { IRule, IGuardAuthErrorProps, IGuardAuthorizationError } from "./types"
import { AuthorizationError } from "blitz"

class GuardAuthorizationError<IResource, IAbility>
  extends AuthorizationError
  implements IGuardAuthorizationError<IResource, IAbility> {
  name = "GuardAuthorizationError"
  rule: Pick<IRule<IResource, IAbility>, "ability" | "resource">

  constructor({ ability, resource, reason }: IGuardAuthErrorProps<IResource, IAbility>) {
    super(reason || "GUARD: UNAUTHORIZED")
    this.rule = { ability, resource }
  }
}

export { GuardAuthorizationError }
