# npm-cache-path

[![npm version](https://img.shields.io/npm/v/npm-cache-path.svg)](https://www.npmjs.com/package/npm-cache-path)
[![Build Status](https://travis-ci.org/shinnn/npm-cache-path.svg?branch=master)](https://travis-ci.org/shinnn/npm-cache-path)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/npm-cache-path.svg)](https://coveralls.io/github/shinnn/npm-cache-path?branch=master)

Get the path of [npm cache folder](https://docs.npmjs.com/cli/cache)

```javascript
const npmCachePath = require('npm-cache-path');

(async () => {
  await npmCachePath(); //=> '/Users/shinnn/.npm'
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install npm-cache-path
```

## API

```javascript
const npmCachePath = require('npm-cache-path');
```

### npmCachePath()

Return: `Promise<string>`

It tries to get the path of [npm](https://docs.npmjs.com/getting-started/what-is-npm) cache folder, first [from the environment variables](https://github.com/shinnn/npm-cache-env), second from the stdout of [`npm config get cache`](https://docs.npmjs.com/cli/config#get) command.

```javascript
// npm_config_cache=/foo/bar node ./example.js

(async () => {
  await npmCachePath(); //=> '/foo/bar'
})();
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
