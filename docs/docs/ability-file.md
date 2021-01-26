---
id: ability-file
title: Ability file
sidebar_label: Ability file
slug: /ability-file
---

This file is the main entrypoint for your rules.
`app/guard/ability.ts`

Eg.

```typescript
import { Ctx } from "blitz"
import { db } from "db"
import { IGuard } from "@blitz-guard/core"

export default async function ability(ctx: Ctx, { can, cannot }: IGuard) {
  cannot("manage", "comment")
  cannot("manage", "article")

  can("read", "article")
  can("read", "comment")

  if (ctx.session.isAuthorized()) {
    can("create", "article")
    can("create", "comment")

    can("delete", "comment", async (_args) => {
      return (await db.comment.count({ where: { userId: ctx.session.userId } })) === 1
    })
  }
}
```

## Can & Cannot

This two methods will allow you to create the rules. Can

```
can(ability, resource, guard)
cannot(ability, resource, guard)
```

- **ability**: `create, read, update, delete, manage, string`
- **resource**: `*your prisma models*, all, string`
- **guard**: `async (args) => boolean`
