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
import { GuardBuilder } from "@blitz-guard/core"

type ExtendedResourceTypes = "comment" | "article" | "users"

const Guard = GuardBuilder<ExtendedResourceTypes>(
	...

```

## Prisma users

Prisma provides a type that contains the
You simply need to import the `Prisma` named export from `db` and use `Prisma.ModelName` as part of your resource types.

```typescript {4}
import db, { Prisma } from "db"
import { GuardBuilder } from "@blitz-guard/core"

type ExtendedResourceTypes = Prisma.ModelName

const Guard = GuardBuilder<ExtendedResourceTypes>(
	...

```
