import db, { Prisma } from "db"
import { GuardBuilder } from "@blitz-guard/core"

type ExtendedResourceTypes = "comment" | "article" | Prisma.ModelName

type ExtendedAbilityTypes = "send email"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    cannot("manage", "all").reason("You did something wrong!")
    /*
		Your rules go here, you can start by removing access to everything
		and gradually adding the necessary permissions

		eg:
		cannot("manage", "comment")
		cannot("manage", "article")

		can("read", "article")
		can("read", "comment")

		if (ctx.session.isAuthorized()) {
			can("create", "article")
			can("create", "comment")
			can("send email", "comment")

			can("delete", "comment", async (_args) => {
				return (await db.comment.count({ where: { userId: ctx.session.userId } })) === 1
			})
		}
    */
  }
)

export default Guard
