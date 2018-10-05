'use strict';

const {execFile} = require('child_process');
const {promisify} = require('util');

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');
const npmCacheEnv = require('npm-cache-env');

const promisifiedExecFile = promisify(execFile);
const unsupportedOptions = new Set(['encoding', 'shell']);

module.exports = async function npmCachePath(...args) {
	const argLen = args.length;
	const [options] = args;

	if (argLen === 1) {
		if (!isPlainObj(options)) {
			const error = new TypeError(`Expected an object to specify child_process.exec options, but got ${
				inspectWithKind(options)
			}.`);
			error.code = 'ERR_INVALID_OPT_VALUE';

			throw error;
		}

		for (const optionName of unsupportedOptions) {
			const val = options[optionName];

			if (val === undefined) {
				continue;
			}

			throw new TypeError(`\`${optionName}\` option is not supported, but ${
				inspectWithKind(val)
			} was provided.`);
		}
	} else if (argLen !== 0) {
		throw new RangeError(`Expected 0 or 1 argument ([options: <Object>]), but got ${argLen} arguments instead.`);
	}

	const resultFromEnv = npmCacheEnv();

	if (resultFromEnv) {
		return resultFromEnv;
	}

	return (await promisifiedExecFile('npm', ['config', 'get', 'cache'], Object.assign({}, options, { // eslint-disable-line prefer-object-spread
		shell: process.platform === 'win32'
	}))).stdout.trim();
};
