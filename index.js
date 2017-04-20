/*!
 * npm-cache-path | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/npm-cache-path
*/
'use strict';

var exec = require('child_process').exec;

var appendType = require('append-type');
var isPlainObj = require('is-plain-obj');
var npmCacheEnv = require('npm-cache-env');
var PinkiePromise = require('pinkie-promise');

module.exports = function npmCachePath(options) {
  return new PinkiePromise(function(resolve, reject) {
    if (options !== undefined) {
      if (!isPlainObj(options)) {
        throw new TypeError(
          'Expected an object to specify child_process.exec options, but got ' +
          appendType(options) +
          '.'
        );
      }

      if (options.encoding) {
        throw new TypeError(
          '`encoding` option is not supported, but ' +
          appendType(options.encoding) +
          ' was provided.'
        );
      }
    } else {
      options = {encoding: 'utf8'};
    }

    var pathFromEnv = npmCacheEnv();

    if (pathFromEnv) {
      resolve(pathFromEnv);
      return;
    }

    exec('npm config get cache', options, function(err, stdout) {
      if (err) {
        reject(err);
        return;
      }

      resolve(stdout.trim());
    });
  });
};
