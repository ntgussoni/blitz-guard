import { Ctx } from "blitz"
import db, { CommentDeleteArgs } from "db"

type DeleteCommentInput = Pick<CommentDeleteArgs, "where">

export default async function deleteComment({ where }: DeleteCommentInput, ctx: Ctx) {
  ctx.session.authorize()

  const comment = await db.comment.delete({ where })

  return comment
}
