import * as core from '@form8ion/core';
import {packageManagers} from '@form8ion/javascript-core';
import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import derive from './package-manager';

suite('package manager', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
  });

  teardown(() => sandbox.restore());

  test('that an already defined manager is returned directly', async () => {
    const packageManager = any.word();

    assert.equal(await derive({packageManager}), packageManager);
  });

  test('that `npm` is returned when a package lockfile exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/package-lock.json`).resolves(true);

    assert.equal(await derive({projectRoot}), packageManagers.NPM);
  });

  test('that `yarn` is returned when a yarn lockfile exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/yarn.lock`).resolves(true);

    assert.equal(await derive({projectRoot}), packageManagers.YARN);
  });

  test('that an error is thrown when no manager is provided and no lockfile is found', async () => {
    try {
      await derive({projectRoot});

      throw new Error('test should have thrown before this point');
    } catch (e) {
      assert.equal(e.message, 'Package-manager could not be determined');
    }
  });
});
