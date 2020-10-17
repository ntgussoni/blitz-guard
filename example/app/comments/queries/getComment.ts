import { authorize } from "app/guard"
import { NotFoundError } from "blitz"
import db, { FindFirstCommentArgs } from "db"

type GetCommentInput = Pick<FindFirstCommentArgs, "where">

export default authorize("read", "comment", async function getComment({ where }: GetCommentInput) {
  const comment = await db.comment.findFirst({ where })

  if (!comment) throw new NotFoundError()

  return comment
})
