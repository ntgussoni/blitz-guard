---
id: testing
title: Testing your rules
sidebar_label: Testing your rules
slug: /testing-your-rules
---

Testing your rules is straightforward.
Simply import your Guard instance from the ability file and use `Guard.can` to test the rules against different conditions.

## Testing your business logic

```typescript
// app/guard/ability
const Guard = GuardBuilder(
  async (ctx, { can, cannot }) => {
    cannot("manage", "comment")
    cannot("manage", "article")

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
...

// test

expect(Guard.can("read","article", {}, {}).can).toBe(true)
```

## Testing your endpoints

Guard.authorize will raise an `AuthorizationError` exception if the user is not authorized, this is what you have to look for when testing your endpoints.

```typescript
...
try {
  await createMessage(
    {
      data: {
       ...
      },
    },
    ctx,
  )
  fail("This call should throw an exception")
} catch (e) {
  let error = e as AuthorizationError
  expect(error.statusCode).toEqual(403)
  expect(error.name).toEqual("AuthorizationError")
  // expect(error.message).toEqual("Some reason")
}
...
```
