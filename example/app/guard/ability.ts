import { Ctx } from "blitz"
import { IGuard } from "blitz-guard"

export default async function ability(ctx: Ctx, { can, cannot }: IGuard) {
  cannot("manage", "comment")
  console.log("WAT")
  if (ctx.session.isAuthorized()) {
    cannot("manage", "comment")
  }
}
