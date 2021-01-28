---
id: contributing
title: How to contribute
sidebar_label: How to contribute
slug: /contributing
---

:rocket: We are happy you are here! Blitz Guard is built by all of us, if you want to contribute and this guide is not enough don't hesitate to [start a discussion](https://github.com/ntgussoni/blitz-guard/discussions/new)

## Development

**1.** Fork the blitz-guard repo

**2.** Clone your forked repo

```bash
git clone git@github.com:[YOUR_GITHUB_USERNAME]/blitz-guard.git
cd blitz
```

**3.** Install dependencies

```bash
yarn
```

**4.** Start the package server. This must be running for any package development or example development

```bash
yarn dev
```

**5.** Run tests

```bash
yarn test
```

### Sync your fork

If your fork is outdated, get the latest changes from the main branch.

```bash
git remote add upstream git@github.com:ntgussoni/blitz-guard.git
git fetch upstream
git merge upstream/main
```

## Package structure

Blitz Guard is a [lerna monorepo](https://github.com/lerna/lerna) with [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/), this makes it easier to build, test and release.

It currently consists of 3 main folders

<br/>

### Core

`/packages/core`: It's the library itself. Any change that you'like to do to Blitz Guard goes here.

Run `yarn dev` from the root of the repo.

<br/>

### Example App

`/example`: It's a basic example app with Blitz Guard set up.
It's linked to package/core so any change that you do the package will be reflected in the example app.

```bash
yarn example:dev
```

:::info
If its the first time you'll need to run `cd example && blitz prisma generate` to generate the prisma client.
:::

<br/>

### Documentation

`/docs` : A [Docusaurus](https://v2.docusaurus.io/) site with all the documentation for Blitz Guard.

Run the development server:

```bash
yarn docs:dev
```
