import {promises as fs} from 'fs';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import testApplicability from './test';

suite('applicability test', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'stat');
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned if the project has an `.nvmrc` file', async () => {
    const projectRoot = any.string();
    fs.stat.withArgs(`${projectRoot}/.nvmrc`).returns({isFile: () => true});

    assert.isTrue(await testApplicability({projectRoot}));
  });

  test('that `false` is returned if the project\'s `.nvmrc` is not file', async () => {
    const projectRoot = any.string();
    fs.stat.withArgs(`${projectRoot}/.nvmrc`).returns({isFile: () => false});

    assert.isFalse(await testApplicability({projectRoot}));
  });

  test('that `false` is returned if the project does not have an `.nvmrc` file', async () => {
    const error = new Error();
    error.code = 'ENOENT';
    fs.stat.rejects(error);

    assert.isFalse(await testApplicability({}));
  });

  test('that errors other than for missing file', async () => {
    const error = new Error();
    error.code = any.word();
    fs.stat.rejects(error);

    try {
      await testApplicability({});

      throw new Error('an error should have been thrown by the module under test');
    } catch (e) {
      assert.equal(e, error);
    }
  });
});
