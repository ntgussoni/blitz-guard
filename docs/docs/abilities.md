---
id: abilities
title: Abilities
sidebar_label: Abilities
slug: /abilities
---

The ability is the action that the user can perform.
Out of the box the following are present `create, read, update, delete, manage`.
`manage` is special, because **it will match all the abilities**

## Extending the abilities

```typescript {4}
import { GuardBuilder, PrismaModelsType } from "@blitz-guard/core"

type ExtendedResourceTypes = ...
type ExtendedAbilityTypes = "send email"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
	...

```
