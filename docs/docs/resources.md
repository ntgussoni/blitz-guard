---
id: resources
title: Resources
sidebar_label: Resources
slug: /resources
---

The resource is the subject of the action you are performing.
Out of the box only `all` is present. **It's special and it will apply to all resources.**

## Extending the resources

You can extend the resources easily by passing a tuple to `GuardBuilder`

```typescript {3}
import { GuardBuilder, PrismaModelsType } from "@blitz-guard/core"

type ExtendedResourceTypes = "comment" | "article" | "users"

const Guard = GuardBuilder<ExtendedResourceTypes>(
	...

```

## Prisma users

There's a very useful utility function to generate a type based on the model names of your prisma database.
You simply need to add `PrismaModelsType<typeof db>` as part of your resource types.

```typescript {3}
import { GuardBuilder, PrismaModelsType } from "@blitz-guard/core"

type ExtendedResourceTypes = PrismaModelsType<typeof db>

const Guard = GuardBuilder<ExtendedResourceTypes>(
	...

```
