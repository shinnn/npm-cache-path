'use strict';

const {join} = require('path');

const getCacacheInfo = require('cacache').get.info;
const npmCachePath = require('.');
const lstat = require('lstat');
const test = require('tape');

test('npmCachePath()', t => {
  t.plan(2);

  npmCachePath().then(path => {
    lstat(path).then(stat => {
      t.ok(stat.isDirectory(), 'should get a path to the directory.');
    }).catch(t.fail);

    getCacacheInfo(
      join(path, '_cacache'),
      'make-fetch-happen:request-cache:https://registry.npmjs.org/lstat/-/lstat-1.0.0.tgz'
    ).then(({size}) => {
      t.ok(Number.isSafeInteger(size), 'should get a path where packages are cached.');
    }).catch(t.fail);
  });
});

test('npmCachePath() in a non-npm environment', t => {
  t.plan(5);

  delete process.env.npm_lifecycle_event;
  delete process.env.npm_config_cache;

  npmCachePath().then(path => {
    lstat(path).then(stat => {
      t.ok(stat.isDirectory(), 'should get a path to the directory.');
    }).catch(t.fail);

    getCacacheInfo(
      join(path, '_cacache'),
      'make-fetch-happen:request-cache:https://registry.npmjs.org/lstat/-/lstat-1.0.0.tgz'
    ).then(({size}) => {
      t.ok(Number.isSafeInteger(size), 'should get a path where packages are cached.');
    }).catch(t.fail);
  });

  npmCachePath({maxBuffer: 1}).catch(err => {
    t.equal(
      err.toString(),
      'Error: stdout maxBuffer exceeded',
      'should receive child_process.exec options.'
    );
  });

  npmCachePath('Hi').catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected an object to specify child_process.exec options, but got \'Hi\' (string).',
      'should support'
    );
  });

  npmCachePath({encoding: 'base64'}).catch(err => {
    t.equal(
      err.toString(),
      'TypeError: `encoding` option is not supported, but \'base64\' (string) was provided.',
      'should'
    );
  });
});
