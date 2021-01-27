import Guard from "app/guard/ability"
import db, { Prisma } from "db"

type UpdateProjectInput = Pick<Prisma.ProjectUpdateArgs, "where" | "data">

async function updateProject({ where, data }: UpdateProjectInput) {
  return await db.project.update({ where, data })
}

export default Guard.authorize("update", "project", updateProject)
