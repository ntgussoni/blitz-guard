---
id: use-guard-hook
title: useGuard Hook
sidebar_label: useGuard Hook
slug: /use-guard-hook
---

The hook lets you do a permissions check in the frontend.

```typescript
import { useGuard } from "app/guard"

const [[canCreateComment, canDeleteComment], { isLoading }] = useGuard([
  ["create", "comment"],
  ["delete", "comment" /* args */],
])
```
