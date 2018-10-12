'use strict';

const {join} = require('path');
const {lstat} = require('fs').promises;

const getCacacheInfo = require('cacache').get.info;
const npmCachePath = require('.');
const test = require('tape');

test('npmCachePath()', async t => {
	const path = await npmCachePath();

	t.ok(
		(await lstat(path)).isDirectory(),
		'should get a path to the directory.'
	);

	t.ok(Number.isSafeInteger((await getCacacheInfo(
		join(path, '_cacache'),
		`make-fetch-happen:request-cache:https://registry.npmjs.org/eslint/-/eslint-${
			require('eslint/package.json').version
		}.tgz`
	)).size), 'should get a path where packages are cached.');

	try {
		await npmCachePath('Hi');
		t.fail('Unexpectedlt succeeded.');
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected no arguments, but received 1 arguments.',
			'should fail when it takes arguments.'
		);
	}

	t.end();
});

test('npmCachePath() in a non-npm environment', async t => {
	delete process.env.npm_lifecycle_event;
	delete process.env.npm_config_cache;

	const path = await npmCachePath();

	t.ok(
		(await lstat(path)).isDirectory(),
		'should get a path to the directory.'
	);

	t.ok(Number.isSafeInteger((await getCacacheInfo(
		join(path, '_cacache'),
		`make-fetch-happen:request-cache:https://registry.npmjs.org/cacache/-/cacache-${
			require('cacache/package.json').version
		}.tgz`
	)).size), 'should get a path where packages are cached.');

	t.end();
});
