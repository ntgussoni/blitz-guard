import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getComment from "app/comments/queries/getComment"
import deleteComment from "app/comments/mutations/deleteComment"
import { useGuard } from "app/guard"

export const Comment = () => {
  const router = useRouter()
  const commentId = useParam("commentId", "number")
  const [comment] = useQuery(getComment, { where: { id: commentId } })
  const [[canEditComment]] = useGuard([["read", "comment"]])
  const [deleteCommentMutation] = useMutation(deleteComment)

  return (
    <div>
      <h1>Comment {comment.id}</h1>
      <pre>{JSON.stringify(comment, null, 2)}</pre>

      {canEditComment && (
        <Link href="/comments/[commentId]/edit" as={`/comments/${comment.id}/edit`}>
          <a>Edit</a>
        </Link>
      )}

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteCommentMutation({ where: { id: comment.id } })
            router.push("/comments")
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowCommentPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/comments">
          <a>Comments</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Comment />
      </Suspense>
    </div>
  )
}

ShowCommentPage.getLayout = (page) => <Layout title={"Comment"}>{page}</Layout>

export default ShowCommentPage
