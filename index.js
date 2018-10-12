'use strict';

const {execFile} = require('child_process');
const {promisify} = require('util');

const npmCacheEnv = require('npm-cache-env');

const promisifiedExecFile = promisify(execFile);

module.exports = async function npmCachePath(...args) {
	const argLen = args.length;

	if (argLen !== 0) {
		throw new RangeError(`Expected no arguments, but received ${argLen} arguments.`);
	}

	return npmCacheEnv() || (await promisifiedExecFile('npm', ['config', 'get', 'cache'], {
		shell: process.platform === 'win32',
		timeout: 5000
	})).stdout.trim();
};
