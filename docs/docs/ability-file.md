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
    cannot("manage", "all") // See "Best practices" section

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

## Rules

The ability file is read top to bottom, the bottom rules take more precedence that the ones at the top.

Take the following example:

```typescript
...

const Guard = GuardBuilder(
	cannot('manage', 'all')

	can("create", "article")
	cannot("create", "article")
)

Guard.can("create", "article",{},{}) // false

```

### Best practices

> Remove all permissions, give them one by one.

Your logic will be more direct and easier to follow, this reduces confusion and potential bugs.

```typescript
cannot("manage", "all") // This removes all abilities for all resources

can("create", "article")

if (some_condition()) {
  can("delete", "article")
}
```

:::caution
Blitz Guard will allow everything unless you state otherwise. No rules means that everything is allowed.
:::

<br/>

> if guards look similar, take some code out of them

Guard will execute the guard condition if the rule matches the ability and resource.
This means that you should, whenever possible, take as much logic out of the rule's guard.

```typescript
// Wrong ❌
can("delete", "article", (ctx) => someHeavyMethod() === true)
can("update", "article", (ctx) => someHeavyMethod() === true)
```

```typescript
// Right ✅
if (someHeavyMethod() === true) {
  can("delete", "article")
  can("update", "article")
}
```

## Can & Cannot

These two methods will determine what a user can or cannot do in your application.

```typescript
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
  It's the condition for the rule to apply, _args_ are passed down from a wrapped mutation or query or manually when calling [Guard.can](https://ntgussoni.github.io/blitz-guard/docs/secure-your-endpoints#check-rules-inside-a-querymutation)<br/>
  `async (args) => boolean`

## Reasons

With each rule, you can define a reason for it.

The text will be used in replacement of the `AuthorizationError` message for both the [authorizePipe](secure-your-endpoints.md#guardauthorizepipe) and [authorize](secure-your-endpoints.md#guardauthorize)

While using [Guard.can](secure-your-endpoints.md#check-rules-inside-a-querymutation) you will receive the result, true/false and the reason.

```typescript
...

const Guard = GuardBuilder(
	cannot('manage', 'all')

	can("create", "article")
	cannot("create", "article").reason("Because I say so")
)

const { can, reason } = Guard.can("create", "article",{},{})
console.log(can) // false
console.log(reason) // "Because I say so"
```
