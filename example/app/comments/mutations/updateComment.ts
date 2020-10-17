import { Ctx } from "blitz"
import db, { CommentUpdateArgs } from "db"

type UpdateCommentInput = Pick<CommentUpdateArgs, "where" | "data">

export default async function updateComment({ where, data }: UpdateCommentInput, ctx: Ctx) {
  ctx.session.authorize()

  const comment = await db.comment.update({ where, data })

  return comment
}
