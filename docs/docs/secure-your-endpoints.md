---
id: secure-your-endpoints
title: How to secure your endpoints
sidebar_label: How to secure your endpoints
slug: /secure-your-endpoints
---

## Guard.authorize

The `Guard.authorize` HOF will protect your endpoint and authorize your user based on your rules.
If the user is not authorized an `AuthorizationError` will be thrown.

Eg:

```typescript {10}
import Guard from "app/guard/ability"
import db, { Prisma } from "db"

type UpdateProjectInput = Pick<Prisma.ProjectUpdateArgs, "where" | "data">

async function updateProject({ where, data }: UpdateProjectInput) {
  return await db.project.update({ where, data })
}

export default Guard.authorize("update", "project", updateProject)
```

`authorize(ability, resource, callback)`

- **ability**<br/>
  The action that the user can perform.<br/>
  Default: `create, read, update, delete, manage` <br/>
  [More information](abilities)

- **resource**<br/>
  The subject of the action.<br/>
  Default: `all`<br/>
  [More information](resources)

- **callback** :<br/>
  It's your query or mutation<br/>
  `async (args) => Promise<any>`

## Guard.authorizePipe

If you are using pipes in your queries or mutations you can use Guard.authorizePipe as shown in the example. If the authorization fails it will throw an `AuthorizationError`

```typescript
import Guard from "app/guard/ability"
import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

export const CreateProject = z.object({
  name: z.string(),
  dueDate: z.date().optional(),
  orgId: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(CreateProject),
  Guard.authorizePipe("create", "project"),
  // Set default orgId
  (input, { session }) => ({
    ...input,
    orgId: input.orgId ?? session.orgId,
  }),
  async (input, ctx) => {
    console.log("Creating project...", input.orgId)
    const project = await db.project.create({
      data: input,
    })
    console.log("Created project")
    return project
  },
)
```

`authorizePipe(ability, resource)`

- **ability**<br/>
  The action that the user can perform.<br/>
  Default: `create, read, update, delete, manage` <br/>
  [More information](abilities)

- **resource**<br/>
  The subject of the action.<br/>
  Default: `all`<br/>
  [More information](resources)

## Check rules inside a query/mutation

Sometimes you need to decide whether to execute portions of your code based on some conditions.
You can use `Guard.can` for this purpose.

```typescript {10}
...
async function updateProject({ where, data }: UpdateProjectInput, ctx: Ctx) {

	if ((Guard.can( "send", "project_email", ctx, { where, data }))) {
		await sendEmail()
	}

	return await db.project.update({ where, data })
}
...
```

`Guard.can(ability, resource, ctx, args)`
