---
id: cancannot
title: Can and Cannot
sidebar_label: Can and Cannot
slug: /can-cannot
---

This two methods will allow you to create the rules.

```
can(ability, resource, guard)
cannot(ability, resource, guard)
```

- **ability**: `create, read, update, delete, manage, string`
- **resource**: `*your prisma models*, all, string`
- guard: `async (args) => boolean`
