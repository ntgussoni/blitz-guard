---
id: secure-your-endpoints
title: Secure your endpoints
sidebar_label: Secure your endpoints
slug: /secure-your-endpoints
---

The `authorize` wrapper will protect your endpoint and check the rules. If the user is not authorized an `AuthorizationError` will be thrown.

Eg. `app/comments/queries/getComment.ts`

```typescript
import { authorize } from "app/guard"

export default authorize("read", "comment", async function getComment(...) {
	...
})
```

`authorize(ability, resource, callback)`

- **ability**: `create, read, updated, delete, manage, string`
- **resource**: _your prisma models_, string
- **callback**: _Typically your endpoint method_
