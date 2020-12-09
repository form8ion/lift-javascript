import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import * as config from './config';
import liftEslint from './lift';

suite('eslint lifter', () => {
  let sandbox;
  const scope = any.word();
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(config, 'default');
  });

  teardown(() => sandbox.restore());

  test('that an error is thrown if a scope is not provided', async () => {
    await assert.isRejected(liftEslint({projectRoot}), 'No scope provided for ESLint configs');
    assert.notCalled(config.default);
  });

  test('that the existing file is not updated if no configs are provided', async () => {
    assert.isUndefined((await liftEslint({scope, projectRoot})).nextSteps);
    assert.notCalled(config.default);
  });

  test('that dependencies are listed for requested simple configs', async () => {
    const configs = any.listOf(any.word);

    const {devDependencies} = await liftEslint({configs, scope, projectRoot});

    assert.deepEqual(devDependencies, configs.map(cfg => `${scope}/eslint-config-${cfg}`));
    assert.calledWith(config.default, {projectRoot, configs, scope});
  });

  test('that dependencies are listed for requested complex configs', async () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word()}));

    const {devDependencies} = await liftEslint({configs, scope, projectRoot});

    assert.deepEqual(devDependencies, configs.map(cfg => `${scope}/eslint-config-${cfg.name}`));
    assert.calledWith(config.default, {projectRoot, scope, configs});
  });
});
