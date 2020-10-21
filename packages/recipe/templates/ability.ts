import { Ctx } from "blitz"
import db from "db"
import { IGuard } from "blitz-guard"

export default async function ability(ctx: Ctx, { can, cannot }: IGuard<typeof db>) {
  /*
	Your rules go here
	cannot("manage", "users", (args) => { ... })
	*/
}
