import React from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import createComment from "app/comments/mutations/createComment"
import CommentForm from "app/comments/components/CommentForm"

const NewCommentPage: BlitzPage = () => {
  const router = useRouter()
  const [createCommentMutation] = useMutation(createComment)

  return (
    <div>
      <h1>Create New Comment</h1>

      <CommentForm
        initialValues={{}}
        onSubmit={async () => {
          try {
            const comment = await createCommentMutation({ data: { text: "my comment" } })
            alert("Success!" + JSON.stringify(comment))
            router.push("/comments/[commentId]", `/comments/${comment.id}`)
          } catch (error) {
            alert("Error creating comment " + JSON.stringify(error, null, 2))
          }
        }}
      />

      <p>
        <Link href="/comments">
          <a>Comments</a>
        </Link>
      </p>
    </div>
  )
}

NewCommentPage.getLayout = (page) => <Layout title={"Create New Comment"}>{page}</Layout>

export default NewCommentPage
