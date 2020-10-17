import { Ctx } from "blitz"
import { IGuard } from "blitz-guard"

export default async function ability(ctx: Ctx, { can, cannot }: IGuard) {
  /*
	Your rules go here
	cannot("manage", "users", (args) => { ... })
	*/
}
