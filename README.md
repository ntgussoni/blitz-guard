![Blitz Guard](blitz-guard.png)

> Easy authorization for Blitz.js

## Install

Using the recipe is the easiest way. It will add the packages and create the base configuration files.

```blitz install ntgussoni/blitz-guard```

## Basic usage

### Abilities
This file is the main entrypoint for your rules.
`app/guard/ability.ts`

Eg.
```typescript
import { Ctx } from "blitz"
import { db } from "db"
import { IGuard } from "blitz-guard"
import { DeleteCommentInput } from "app/comments/mutations/deleteComments"

export default async function ability(ctx: Ctx, { can, cannot }: IGuard) {
  cannot("manage", "comment")
  cannot("manage", "article")

  can("read", "article")
  can("read", "comment")

  if (ctx.session.isAuthorized()) {
	can("create", "article")
	can("create", "comment")

	can("delete", "comment", async (_args) => {
		return await db.comment.count({ where: { userId: ctx.session.userId } }) === 1
	})
  }
}
```
### Can, Cannot
This two methods will allow you to create the rules.

```
can(ability, resource, guard)
cannot(ability, resource, guard)
```

- **ability**: `create, read, update, delete, manage, string`
- **resource**: `*your prisma models*, all, string`
- guard: `async (args) => boolean`

#### Abilities
These are the basic abilities
`create, read, update, delete, manage`

`manage` is special, because it will match all the abilities. Use it as a wildcard

#### Resources
The resources will be autocompleted from Prisma Client, however you can use any string you like.

`all` is special, it will apply to all resources.

### Secure your endpoints

The `authorize` wrapper will protect your endpoint and check the rules. If the user is not authorized an `AuthorizationError` will be thrown.

Eg. `app/comments/queries/getComment.ts`
```typescript
import { authorize } from "app/guard"

export default authorize("read", "comment", async function getComment(...) {
	...
})
```

```authorize(ability, resource, callback)```

- **ability**: `create, read, updated, delete, manage, string`
- **resource**: *your prisma models*, string
- **callback**: *Typically your endpoint method*

### React Hook

The hook lets you do a permissions check in the frontend.

```typescript
import { useGuard } from "app/guard"

const [[canCreateComment, canDeleteComment], { isLoading }] = useCanCan([["create", "comment"], ["delete", "comment", /* args */]])
```

### Middleware

In order to aid your development, you can add a middleware to your `blitz.config.js` that will throw a warning in the console whenever you access an endpoint that is not protected by blitz guard.

**NOTE**: Only enabled in development

```typescript
const { BlitzGuardMiddleware } = require("blitz-guard/dist/middleware.js")

module.exports = {
  middleware: [
    ...
    BlitzGuardMiddleware({
      excluded: [],
    }),
  ],
}

```

If you don't want to be warned about certain api routes, you can pass an array of excluded routes.

```typescript
...
BlitzGuardMiddleware({
	excluded: ["/api/auth/mutations/login", "/api/auth/mutations/logout"],
}),
...
```
