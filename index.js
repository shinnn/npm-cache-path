/*!
 * npm-cache-path | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/npm-cache-path
*/
'use strict';

const exec = require('child_process').exec;

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');
const npmCacheEnv = require('npm-cache-env');
const stripEof = require('strip-eof');

module.exports = function npmCachePath(options) {
  return new Promise((resolve, reject) => {
    if (options !== undefined) {
      if (!isPlainObj(options)) {
        throw new TypeError(`Expected an object to specify child_process.exec options, but got ${
          inspectWithKind(options)
        }.`);
      }

      if (options.encoding) {
        throw new TypeError(`\`encoding\` option is not supported, but ${
          inspectWithKind(options.encoding)
        } was provided.`);
      }
    } else {
      options = {encoding: 'utf8'};
    }

    const pathFromEnv = npmCacheEnv();

    if (pathFromEnv) {
      resolve(pathFromEnv);
      return;
    }

    exec('npm config get cache', options, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stripEof(stdout));
    });
  });
};
