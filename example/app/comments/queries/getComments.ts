import { Ctx } from "blitz"
import db, { FindManyCommentArgs } from "db"

type GetCommentsInput = Pick<FindManyCommentArgs, "where" | "orderBy" | "skip" | "take">

export default async function getComments(
  { where, orderBy, skip = 0, take }: GetCommentsInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const comments = await db.comment.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.comment.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    comments,
    nextPage,
    hasMore,
    count,
  }
}
