'use strict';

const {exec} = require('child_process');
const {promisify} = require('util');

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');
const npmCacheEnv = require('npm-cache-env');

const promisifiedExec = promisify(exec);

module.exports = async function npmCachePath(...args) {
	const argLen = args.length;
	const [options] = args;

	if (argLen === 1) {
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
	} else if (argLen !== 0) {
		throw new RangeError(`Expected 0 or 1 argument ([options: <Object>]), but got ${argLen} arguments instead.`);
	}

	return npmCacheEnv() || (await promisifiedExec('npm config get cache', options)).stdout.trim();
};

