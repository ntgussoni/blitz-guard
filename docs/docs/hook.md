---
id: hook
title: Check permissions in the frontend
sidebar_label: Check permissions in the frontend
slug: /hook
---

If you need to validate a rule in the frontend we got'chu.
Just use the predefined `Guard.getAbility` query with a regular useQuery hook.

```typescript
import { useQuery } from "blitz"
import getAbility from "app/guard/queries/getAbility"

const [[canCreateComment, canDeleteComment], { isLoading }] = useQuery(getAbility, [
  ["create", "comment"],
  ["delete", "comment" /* args */],
])

console.log(canCreateComment.can) // true
console.log(canCreateComment.reason) // "some reason"

console.log(canDeleteComment.can) // false
console.log(canDeleteComment.reason) // "some reason"
```
