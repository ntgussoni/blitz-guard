---
id: secure-your-endpoints
title: Secure your endpoints
sidebar_label: Secure your endpoints
slug: /secure-your-endpoints
---

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

## Check rules inside a query/mutation

Sometimes you need to decide whether to execute portions of your code based on some conditions.
You can use `Guard.can` for this purpose.

```typescript {10}
...
async function updateProject({ where, data }: UpdateProjectInput, ctx: Ctx) {

	if ((Guard.can(ctx, { where, data }), "send", "project_email")) {
		await sendEmail()
	}

	return await db.project.update({ where, data })
}
...
```
