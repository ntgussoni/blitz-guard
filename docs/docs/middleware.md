---
id: middleware
title: Developer middleware
sidebar_label: Developer middleware
slug: /middleware
---

In order to aid your development, you can add a middleware to your `blitz.config.js` that will throw a warning in the console whenever you access an endpoint that is not protected by blitz guard.

**NOTE**: Only enabled in development

```typescript
const { BlitzGuardMiddleware } = require("blitz-guard/dist/middleware.js")

module.exports = {
  middleware: [
    ...BlitzGuardMiddleware({
      excluded: [],
    }),
  ],
}
```

If you don't want to be warned about certain api routes, you can pass an array of excluded routes.

```typescript
...
BlitzGuardMiddleware({
	excluded: ["/api/auth/mutations/login", "/api/auth/mutations/logout"],
}),
...
```
