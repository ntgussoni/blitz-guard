import { Ctx } from "blitz"
import db, { CommentCreateArgs } from "db"

type CreateCommentInput = Pick<CommentCreateArgs, "data">
export default async function createComment({ data }: CreateCommentInput, ctx: Ctx) {
  ctx.session.authorize()

  const comment = await db.comment.create({ data })

  return comment
}
