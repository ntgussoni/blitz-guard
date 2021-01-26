import Ability from "app/guard/ability"
import { NotFoundError } from "blitz"
import db, { FindFirstCommentArgs } from "db"

async function getComment({ where }: FindFirstCommentArgs) {
  const comment = await db.comment.findFirst({ where })

  if (!comment) throw new NotFoundError()

  return comment
}

export default Ability.authorize("create", "comment", getComment)
