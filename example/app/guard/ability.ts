import { Ctx } from "blitz"
import { IGuard } from "blitz-guard"
export default async function ability(ctx: Ctx, { rules, can, cannot }: IGuard) {
  cannot("manage", "comment")

  if (ctx.session.isAuthorized()) {
    can("manage", "comment")
  }
}
