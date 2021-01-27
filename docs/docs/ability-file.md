---
id: ability-file
title: Ability file
sidebar_label: Ability file
slug: /ability-file
---

This file is the main entrypoint for your rules, it will instantiate Guard and assign the specified types.

See: `app/guard/ability.ts`

```typescript
import db from "db"
import { GuardBuilder, PrismaModelsType } from "@blitz-guard/core"

type ExtendedResourceTypes = "comment" | "article" | PrismaModelsType<typeof db>
type ExtendedAbilityTypes = "send email"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    cannot("manage", "comment")
    cannot("manage", "article")

    can("read", "article")
    can("read", "comment")

    if (ctx.session.isAuthorized()) {
      can("create", "article")
      can("create", "comment")
      can("send email", "comment")

      can("delete", "comment", async (_args) => {
        return (await db.comment.count({ where: { userId: ctx.session.userId } })) === 1
      })
    }
  },
)

export default Guard
```

## Can & Cannot

These two methods will determine what a user can or cannot do in your application.

```
can(ability, resource, guard)
cannot(ability, resource, guard)
```

- **ability**<br/>
  The action that the user can perform.<br/>
  Default: `create, read, update, delete, manage` <br/>
  [More information](abilities)

- **resource**<br/>
  The subject of the action.<br/>
  Default: `all`<br/>
  [More information](resources)

- **guard** (_optional_):<br/>
  It's the condition for the rule to apply, *args* are passed down from a wrapped mutation or query or manually when calling [Guard.can](https://ntgussoni.github.io/blitz-guard/docs/secure-your-endpoints#check-rules-inside-a-querymutation)<br/>
  `async (args) => boolean`
