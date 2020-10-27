import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as packageLifter from './package';
import * as eslintLifter from './eslint/lift';
import lift from './lift';

suite('lift', () => {
  let sandbox;
  const projectRoot = any.string();
  const scripts = any.simpleObject();
  const tags = any.listOf(any.word);
  const eslintConfigs = any.listOf(any.word);
  const dependencies = any.listOf(any.word);
  const devDependencies = any.listOf(any.word);
  const results = {...any.simpleObject(), scripts, tags, eslintConfigs, dependencies, devDependencies};

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(packageLifter, 'default');
    sandbox.stub(eslintLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that results specific to js projects are lifted', async () => {
    const scope = any.word();
    const eslintDevDependencies = any.listOf(any.word);
    const eslintNextSteps = any.listOf(any.simpleObject);
    const eslintLiftResults = {
      ...any.simpleObject(),
      nextSteps: eslintNextSteps,
      devDependencies: eslintDevDependencies
    };
    eslintLifter.default.withArgs({configs: eslintConfigs, scope}).resolves(eslintLiftResults);

    const liftResults = await lift({projectRoot, results, configs: {eslint: {scope}}});

    assert.deepEqual(liftResults, {nextSteps: eslintNextSteps});
    assert.calledWith(
      packageLifter.default,
      {projectRoot, scripts, tags, dependencies, devDependencies, eslintDevDependencies}
    );
  });

  test('that eslint-configs are not processed if configs are not provided', async () => {
    const liftResults = await lift({projectRoot, results});

    assert.deepEqual(liftResults, {});
  });

  test('that eslint-configs are not processed if config for eslint is not provided', async () => {
    const liftResults = await lift({projectRoot, results, configs: any.simpleObject()});

    assert.deepEqual(liftResults, {});
  });
});
