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
import Guard from "app/guard/ability"

const [[canCreateComment, canDeleteComment], { isLoading }] = useQuery(Guard.getAbility, [
  ["create", "comment"],
  ["delete", "comment" /* args */],
])

console.log(canDeleteComment) // true
console.log(canDeleteComment) // false
```
