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
      return (await db.comment.count({ where: { userId: ctx.session.userId } })) === 1
    })
  }
}
```
