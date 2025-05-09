# UID Generator

> A small package for generating cryptographically secure UIDs in the browser, safe for both cookie and URL usage.

[![npm](https://img.shields.io/npm/v/crypto-uid.svg?style=flat-square)](https://www.npmjs.com/package/crypto-uid)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/rolandjitsu/uid/Test?label=tests&style=flat-square)](https://github.com/rolandjitsu/uid/actions?query=workflow%3ATest)
[![Coveralls github branch](https://img.shields.io/coveralls/github/rolandjitsu/uid/master?style=flat-square)](https://coveralls.io/github/rolandjitsu/uid?branch=master)

This package is a mirror of [uid-safe](https://github.com/crypto-utils/uid-safe), but meant to be used in a browser env.
Additionally, it comes bundled with [TypeScript](https://www.typescriptlang.org) typings.


# Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Browser Support](#browser-support)
* [Contribute](#contribute)


### Installation
----------------
You can install this package from [NPM](https://www.npmjs.com):
```bash
npm add crypto-uid
```

Or with [Yarn](https://yarnpkg.com/en):
```bash
yarn add crypto-uid
```

#### CDN
For CDN, you can use [unpkg](https://unpkg.com):

[https://unpkg.com/crypto-uid/dist/bundles/crypto-uid.umd.min.js](https://unpkg.com/crypto-uid/dist/bundles/crypto-uid.umd.min.js)

The global namespace for crypto-uid is `cryptoUid`:
```js
const id = cryptoUid(6);
```


### Usage
---------

#### ES6
Generate a random UID:
```ts
import uid from 'crypto-uid';
const id = uid(6);
```

#### CommonJS
Generate a random UID:
```ts
const uid = require('crypto-uid');
const id = uid(6);
```


### Browser Support
-------------------
You can expect this lib to run wherever [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) is supported.


### Contribute
--------------
If you wish to contribute, please use the following guidelines:
* Use [Conventional Commits](https://conventionalcommits.org)
* Use `[ci skip]` in commit messages to skip a build
